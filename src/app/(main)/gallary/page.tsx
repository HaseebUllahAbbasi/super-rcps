"use client"

import type React from "react"

import { createImage, deleteImage, fetchAllImages, fetchAllTags, updateImage, updateImageDisplayOrders } from "@/apis/gallary-apis"
import { TagsManagement } from "@/components/gallary/task-manager"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Image, Tag } from "@/types"
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd"
import { Check, Edit, ImageIcon, Loader2, Trash, Upload, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Types


export default function GalleryAdminPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [images, setImages] = useState<Image[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  

  // Fetch images and tags
  const fetchData = async () => {
    try {
      setLoading(true)
      const [imagesRes, tagsRes] = await Promise.all([fetchAllImages(), fetchAllTags()])
      const imagesData = imagesRes?.data?.data?.images || []
      const tagsData = tagsRes?.data?.tags || []
      console.log("The Image data i am getting is imageData", imagesData)

      setImages(imagesData)
      setTags(tagsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load gallery data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle image reordering
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update local state immediately for better UX
    setImages(items)

    // Update display order in the database
    try {
      setReordering(true)

      const imageOrders = items.map((item, index) => ({
        id: item.id,
        order: index,
      }))

      // const response = await fetch("/api/gallery/images", {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ imageOrders }),
      // })
      const response = await updateImageDisplayOrders(imageOrders)
      
      if(response?.error) {
        toast.error(response?.error || "Error while updating image order")
        return
      }

      toast.success("Image order updated successfully")
    } catch (error) {
      console.error("Error updating image order:", error)
      toast.error("Failed to update image order")
      // Revert to original order
      fetchData()
    } finally {
      setReordering(false)
    }
  }

  // Delete an image
  const handleDeleteImage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      setLoading(true)
      const response = await deleteImage(id)
      if(response?.error) {
        toast.error(response?.error || "Error while deleting image")
        return;
      }
      // Remove from local state
      setImages(images.filter((img) => img.id !== id))
      toast.success("Image deleted successfully")
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error("Failed to delete image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <p className="text-muted-foreground">Upload and manage gallery images</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
          <TabsTrigger value="manage">Manage Images</TabsTrigger>
          <TabsTrigger value="tags">Manage Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <ImageUploadForm tags={tags} onSuccess={fetchData} />
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Gallery Images</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No images found. Upload some images to get started.</p>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="images">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {images.map((image, index) => (
                          <Draggable
                            key={image.id.toString()}
                            draggableId={image.id.toString()}
                            index={index}
                            isDragDisabled={reordering}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center gap-4 p-3 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                              >
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={image.imageUrl || "/placeholder.svg"}
                                    alt={image.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium truncate">{image.title}</h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {image.imageTags.map(({ tag }) => (
                                      <Badge key={tag.id} variant="outline" className="text-xs">
                                        {tag.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="icon" onClick={() => setSelectedImage(image)}>
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Edit Image</DialogTitle>
                                      </DialogHeader>
                                      {selectedImage && (
                                        <ImageEditForm
                                          image={selectedImage}
                                          tags={tags}
                                          onSuccess={() => {
                                            fetchData()
                                            setSelectedImage(null)
                                          }}
                                        />
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteImage(image.id)}
                                    disabled={loading}
                                  >
                                    <Trash className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags">
          <TagsManagement tags={tags} onTagsChange={setTags} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Image Upload Form Component
function ImageUploadForm({ tags, onSuccess }: { tags: Tag[]; onSuccess: () => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles])

      // Generate previews
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews])
    }
  }

  // Remove a file from the selection
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index])
    setPreviews(previews.filter((_, i) => i !== index))
  }

  // Handle tag selection
  const handleTagChange = (tagId: number) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (files.length === 0) return toast.error("Please select at least one image")
    if (!title) return toast.error("Please enter a title")
  
    try {
      setUploading(true)
      setUploadProgress(0)
  
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      selectedTags.forEach((tagId) => formData.append("tagIds", tagId.toString()))
  
      files.forEach((file) => {
        formData.append("attachments", file) // Append each image file
      })
  
      const response  = await createImage(formData)
      if(response?.error) {
        toast.error(response?.error || "Error while uploading image")
        return
      }
  
      toast.success(`Successfully uploaded ${files.length} image(s)`)
      setTitle("")
      setDescription("")
      setSelectedTags([])
      setFiles([])
      setPreviews([])
      onSuccess()
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload images")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }
  
  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [previews])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Images</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter image title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter image description"
                rows={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagChange(tag.id)}
                >
                  {selectedTags.includes(tag.id) && <Check className="mr-1 h-3 w-3" />}
                  {tag.name}
                </Badge>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-muted-foreground">No tags available. Create some tags first.</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Upload Images</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input id="images" type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
              <Label htmlFor="images" className="cursor-pointer ">
                <div className="flex flex-col items-center justify-center w-full gap-1">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB each)</p>
                </div>
              </Label>
            </div>
          </div>

          {previews.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Images ({previews.length})</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={uploading || files.length === 0}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {files.length > 0 ? `${files.length} Image(s)` : "Images"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Image Edit Form Component
function ImageEditForm({
  image,
  tags,
  onSuccess,
}: {
  image: Image
  tags: Tag[]
  onSuccess: () => void
}) {
  const [title, setTitle] = useState(image.title)
  const [description, setDescription] = useState(image.description || "")
  const [selectedTags, setSelectedTags] = useState<number[]>(image.imageTags.map((it) => it.tagId))
  const [saving, setSaving] = useState(false)

  // Handle tag selection
  const handleTagChange = (tagId: number) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title) {
      toast.error("Please enter a title")
      return
    }

    try {
      setSaving(true)
      const response = await updateImage(image.id, {
        title,
        description,
        tagIds: selectedTags,
      })

      if(response?.error) {
        toast.error(response?.error || "Error while updating image")
        return
      }

      toast.success("Image updated successfully")
      onSuccess()
    } catch (error) {
      console.error("Error updating image:", error)
      toast.error("Failed to update image")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter image title"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-description">Description (Optional)</Label>
          <Textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter image description"
            rows={1}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTagChange(tag.id)}
            >
              {selectedTags.includes(tag.id) && <Check className="mr-1 h-3 w-3" />}
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="aspect-video w-full rounded-md overflow-hidden border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.imageUrl || "/placeholder.svg"} alt={image.title} className="h-full w-full object-cover" />
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}



