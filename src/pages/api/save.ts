import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

interface MondrianData {
  rectangles: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const data = req.body as MondrianData;
      
      // Create directory if it doesn't exist
      const dataPath = path.join(process.cwd(), "public/mondrian");
      if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath, { recursive: true });
      }

      // Save the rectangles data
      const fileName = `${Date.now()}.json`;
      fs.writeFileSync(
        path.join(dataPath, fileName),
        JSON.stringify(data.rectangles),
        'utf-8'
      );

      res.status(200).json({ message: "Saved successfully!", fileName });
    } catch (error) {
      console.error('Save error:', error);
      res.status(500).json({ message: "Error saving the artwork" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}