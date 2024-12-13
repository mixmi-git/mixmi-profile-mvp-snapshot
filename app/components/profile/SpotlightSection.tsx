'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface Project {
  id: number
  title: string
  description: string
  image: string
  link: string
}

interface SpotlightSectionProps {
  projects: Project[]
  onProjectChange: (index: number, field: keyof Project, value: string) => void
  onAddProject: () => void
  onRemoveProject: (index: number) => void
  onImageChange: (index: number, file: File | null) => void
}

export function SpotlightSection({
  projects,
  onProjectChange,
  onAddProject,
  onRemoveProject,
  onImageChange
}: SpotlightSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold">Spotlight</h3>
        <p className="text-sm text-gray-400 mt-2">
          Share your projects, profiles, and collaborations
        </p>
      </div>
      <Accordion type="single" collapsible>
        {projects.map((project, index) => (
          <AccordionItem key={project.id} value={`project-${index}`}>
            <AccordionTrigger className="flex justify-start gap-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {project.title || `Project ${index + 1}`}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mb-4 p-4 bg-gray-700">
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`project-title-${index}`}>Title</Label>
                    <Input
                      id={`project-title-${index}`}
                      value={project.title}
                      onChange={(e) => onProjectChange(index, 'title', e.target.value)}
                      className="mt-1"
                      placeholder="Project title"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`project-description-${index}`}>Description</Label>
                    <Input
                      id={`project-description-${index}`}
                      value={project.description}
                      onChange={(e) => onProjectChange(index, 'description', e.target.value)}
                      className="mt-1"
                      placeholder="Project description"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`project-image-${index}`}>Image</Label>
                    <div className="mt-2 flex items-center space-x-4">
                      {project.image && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                          <Image 
                            src={project.image} 
                            alt={project.title || 'Project image'} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                      )}
                      <Input
                        id={`project-image-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files
                          if (files && files.length > 0) {
                            onImageChange(index, files[0])
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`project-link-${index}`}>Link</Label>
                    <Input
                      id={`project-link-${index}`}
                      value={project.link}
                      onChange={(e) => onProjectChange(index, 'link', e.target.value)}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>

                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => onRemoveProject(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Remove Project
                  </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button type="button" onClick={onAddProject} className="mt-2">
        <Plus className="w-4 h-4 mr-2" /> Add Project
      </Button>
    </div>
  )
} 