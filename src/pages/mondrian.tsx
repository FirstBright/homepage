import React, { useRef, useState, useEffect } from "react"
import { useRouter } from 'next/router'

interface Rectangle {
  x: number
  y: number
  width: number
  height: number
  color: string
}

const colors = ["white", "white", "white", "white", "white", 
                "white", "white", "white", "#C53652", "#3E5984", "#F8EE67"]

const MondrianCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [rectangles, setRectangles] = useState<Rectangle[]>([])
  const [splitDirectionVertical, setSplitDirectionVertical] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initial rectangle or load from localStorage
    if (rectangles.length === 0) {
        const savedArtwork = localStorage.getItem('editArtwork')
        if (savedArtwork) {
          setRectangles(JSON.parse(savedArtwork))
          localStorage.removeItem('editArtwork')
        } else {
          setRectangles([{
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            color: "white"
          }])
        }
        return
      }


    ctx.clearRect(0, 0, canvas.width, canvas.height)

    rectangles.forEach(rect => {
      ctx.fillStyle = rect.color
      ctx.strokeStyle = "black"
      ctx.lineWidth = 5
      
      ctx.beginPath()
      ctx.rect(rect.x, rect.y, rect.width, rect.height)
      ctx.fill()
      ctx.stroke()
    })
  }, [rectangles])

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const splitRectangle = (clickedRect: Rectangle, relativeX: number, relativeY: number) => {
    if (splitDirectionVertical) {
      // Vertical split
      const leftRect: Rectangle = {
        x: clickedRect.x,
        y: clickedRect.y,
        width: relativeX,
        height: clickedRect.height,
        color: getRandomColor()
      }
      
      const rightRect: Rectangle = {
        x: clickedRect.x + relativeX,
        y: clickedRect.y,
        width: clickedRect.width - relativeX,
        height: clickedRect.height,
        color: getRandomColor()
      }

      setRectangles(prev => [...prev.filter(r => r !== clickedRect), leftRect, rightRect])
    } else {
      // Horizontal split
      const topRect: Rectangle = {
        x: clickedRect.x,
        y: clickedRect.y,
        width: clickedRect.width,
        height: relativeY,
        color: getRandomColor()
      }
      
      const bottomRect: Rectangle = {
        x: clickedRect.x,
        y: clickedRect.y + relativeY,
        width: clickedRect.width,
        height: clickedRect.height - relativeY,
        color: getRandomColor()
      }

      setRectangles(prev => [...prev.filter(r => r !== clickedRect), topRect, bottomRect])
    }
    
    setSplitDirectionVertical(!splitDirectionVertical)
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Find clicked rectangle
    const clickedRect = rectangles.find(r => 
      x >= r.x && x <= r.x + r.width && 
      y >= r.y && y <= r.y + r.height
    )

    if (clickedRect) {
      splitRectangle(clickedRect, x - clickedRect.x, y - clickedRect.y)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/save", {
        method: "POST",
        body: JSON.stringify({ rectangles }),
        headers: { "Content-Type": "application/json" },
      })
      
      if (response.ok) {
        router.push('/gallery')
      } else {
        alert("Failed to save. Please try again.")
      }
    } catch (error) {
      console.error('Save error:', error)
      alert("Error saving the artwork")
    }
  }
  const handleDownload = () => {
    if (!canvasRef.current) return
    
    const link = document.createElement('a')
    const image = canvasRef.current.toDataURL('image/png')
    link.download = `mondrian-${Date.now()}.png`
    link.href = image
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pt-safe">
      <div className="flex flex-col items-center mt-8">
        <div className="relative w-full max-w-[400px] aspect-square mb-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onClick={handleCanvasClick}
            className="w-full h-full border-2 border-black cursor-pointer"
          />
        </div>
        
        <div className="flex gap-2 w-full max-w-[400px]">
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white py-2 px-4 text-sm md:text-base hover:opacity-80 transition-opacity rounded"
          >
            Save to Gallery
          </button>
          <button
            onClick={handleDownload}
            className="w-full bg-green-500 text-white py-2 px-4 text-sm md:text-base hover:opacity-80 transition-opacity rounded"
          >
            Download Image
          </button>
        </div>
        
        <button
          onClick={() => router.push('/gallery')}
          className="mt-4 text-black py-2 px-6 text-sm md:text-base hover:opacity-80 transition-opacity"
        >
          Back to Gallery
        </button>
      </div>
    </div>
  )
}

export default MondrianCanvas