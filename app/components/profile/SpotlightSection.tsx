import { useState } from 'react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  link?: string
}

interface SpotlightSectionProps {
  projects: Project[]
  editable?: boolean
  onProjectsChange?: (projects: Project[]) => void
}

export function SpotlightSection({ 
  projects, 
  editable = false,
  onProjectsChange 
}: SpotlightSectionProps) {
  const [editMode, setEditMode] = useState(false)

  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              {project.link && (
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-sm text-primary hover:underline mt-2 block"
                >
                  View Project →
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
} 