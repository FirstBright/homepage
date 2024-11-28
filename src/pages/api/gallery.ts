import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

interface MondrianArtwork {
  id: string;
  rectangles: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const dataPath = path.join(process.cwd(), "public/mondrian")
    if (req.method === "GET") {
        try {
            if (!fs.existsSync(dataPath)) {
                return res.status(200).json({ artworks: [] });
            }
    
            const files = fs.readdirSync(dataPath);
            const artworks: MondrianArtwork[] = files
                .filter(file => file.endsWith('.json'))
                .map(file => {
                    const id = file.replace('.json', '');
                    const content = fs.readFileSync(path.join(dataPath, file), 'utf-8');
                    return {
                        id,
                        rectangles: JSON.parse(content)
                    };
                });
    
            res.status(200).json({ artworks });
        } catch (error) {
            console.error('Gallery error:', error);
            res.status(500).json({ message: "Error loading gallery" });
        }
    } else if (req.method === "DELETE") {
        try {
            const {id} = req.query
            if(!id||typeof id !== "string") {
                return res.status(400).json({ message: "Invalid id" })
            }
            const filePath = path.join(dataPath, `${id}.json`);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: "Artwork not found" });
            }
            fs.unlinkSync(filePath);
            res.status(200).json({ message: "Artwork deleted successfully" });
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ message: "Error deleting the artwork" });
        }
    }else{
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
     
}