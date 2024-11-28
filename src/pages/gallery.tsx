import React, { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from 'next/router'

interface MondrianArtwork {
  id: string
  rectangles: {
    x: number
    y: number
    width: number
    height: number
    color: string
  }[]
}

const ArtworkDisplay = ({ artwork,onDelete }: { artwork: MondrianArtwork,onDelete: (id: string) => void }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    artwork.rectangles.forEach(rect => {
      ctx.fillStyle = rect.color
      ctx.strokeStyle = "black"
      ctx.lineWidth = 5
      
      ctx.beginPath()
      ctx.rect(rect.x, rect.y, rect.width, rect.height)
      ctx.fill()
      ctx.stroke()
    })
  }, [artwork])

  const handleEdit = () => {
    localStorage.setItem('editArtwork', JSON.stringify(artwork.rectangles))
    router.push('/mondrian')
  }

  const handleSave = () => {
    if (!canvasRef.current) return
    
    // Create a temporary link element
    const link = document.createElement('a')
    
    // Get the canvas data as PNG
    const image = canvasRef.current.toDataURL('image/png')
    
    // Set up the download
    link.download = `mondrian-${Date.now()}.png`
    link.href = image
    
    // Trigger the download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return (
    <div className="bg-white p-2 md:p-3 w-full relative group">
      
      <button
        onClick={() => onDelete(artwork.id)}
        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg hover:bg-red-600 z-10"
        aria-label="Delete artwork"
      >
        ×
      </button>
      <div className="w-full aspect-square mb-2 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full max-w-[400px] max-h-[400px]"
        />
      </div>
      <div className="flex justify-between items-center gap-2">

      <button 
        onClick={handleEdit}
        className="w-full bg-blue-500 text-white py-2 px-4 text-sm md:text-base hover:opacity-80 transition-opacity"
      >
        Edit
      </button>
      <button
        onClick={handleSave}
        className="w-full bg-green-500 text-white py-2 px-4 text-sm md:text-base hover:opacity-80 transition-opacity"
      >
        Save
      </button>
      </div>
    </div>
   
  )
}

const Gallery = () => {
  const [artworks, setArtworks] = useState<MondrianArtwork[]>([])
  const router = useRouter()

  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = async () => {
    try {
      const response = await axios.get("/api/gallery")
      setArtworks(response.data.artworks)
    } catch (error) {
      console.error("Failed to load artworks:", error)
    }
  }
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/gallery?id=${id}`)
      setArtworks(artworks.filter(artwork => artwork.id !== id))
    } catch (error) {
      console.error("Failed to delete artwork:", error)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pt-safe">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {artworks.map((artwork) => (
          <ArtworkDisplay key={artwork.id} artwork={artwork} onDelete={handleDelete} />
        ))}
      </div>
      <div className="text-center py-4 md:py-6">
        <button 
          onClick={() => router.push('/mondrian')}
          className="text-black py-2 px-6 text-sm md:text-base hover:opacity-80 transition-opacity"
        >
          Create New
        </button>
      </div>
    </div>
  )
}

export default Gallery