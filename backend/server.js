import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import cors from "cors";
import stringSimilarity from "string-similarity";

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" });

// Parse CSV and return JSON
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

app.post("/upload", upload.fields([{ name: "file1" }, { name: "file2" }]), async (req, res) => {
  try {
    const file1 = req.files["file1"][0].path;
    const file2 = req.files["file2"][0].path;

    const [data1, data2] = await Promise.all([parseCSV(file1), parseCSV(file2)]);

    const headers1 = Object.keys(data1[0]);
    const headers2 = Object.keys(data2[0]);

    // Simple header mapping
  const mapping = {};
  const usedHeaders2 = new Set();

  // 1. Exact (case-insensitive) matches
  headers1.forEach(h1 => {
    const exact = headers2.find(h2 => h2.toLowerCase() === h1.toLowerCase());
    if (exact) {
      mapping[h1] = exact;
      usedHeaders2.add(exact);
    }
  });

  // 2. String similarity for the rest, avoiding duplicates
  const SIMILARITY_THRESHOLD = 0.5; 

  headers1.forEach(h1 => {
    if (!mapping[h1]) {
      const candidates = headers2.filter(h2 => !usedHeaders2.has(h2));
      if (candidates.length > 0) {
        const { bestMatch } = stringSimilarity.findBestMatch(h1, candidates);
        if (bestMatch.rating >= SIMILARITY_THRESHOLD) {
          mapping[h1] = bestMatch.target;
          usedHeaders2.add(bestMatch.target);
        } else {
          mapping[h1] = ""; // No good match found
        }
      } else {
        mapping[h1] = ""; // No match found
      }
    }
  });

  // Only keep mapped columns (where mapping[h1] is not "")
  const mappedHeaders = Object.entries(mapping)
    .filter(([col1, col2]) => col2 && col2 !== "")
    .map(([col1]) => col1);

  // Find unmapped columns from both datasets
  const unmapped1 = headers1.filter(h1 => !mappedHeaders.includes(h1));
  const unmapped2 = headers2.filter(h2 => !Object.values(mapping).includes(h2));

  // Final header order: mapped columns (from data1), then unmapped from data1, then unmapped from data2
  const finalHeaders = [
    ...mappedHeaders,
    ...unmapped1,
    ...unmapped2
  ];

  // Concatenate all rows from both datasets, using all relevant columns
  const merged = [];

  // Add all rows from data1
  data1.forEach(row1 => {
    const mergedRow = {};
    finalHeaders.forEach(h => {
      mergedRow[h] = row1[h] !== undefined ? row1[h] : "";
    });
    merged.push(mergedRow);
  });

  // Add all rows from data2
  data2.forEach(row2 => {
    const mergedRow = {};
    finalHeaders.forEach(h => {
      // If this header is a mapped column, get the corresponding column from data2
      const mappedH2 = mapping[h];
      if (mappedHeaders.includes(h)) {
        mergedRow[h] = mappedH2 && row2[mappedH2] !== undefined ? row2[mappedH2] : "";
      } else if (unmapped2.includes(h)) {
        mergedRow[h] = row2[h] !== undefined ? row2[h] : "";
      } else {
        mergedRow[h] = "";
      }
    });
    merged.push(mergedRow);
  });

  // ...existing code...
  res.json({ mapping, merged });
  // ...existing code...

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Integration failed" });
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));
