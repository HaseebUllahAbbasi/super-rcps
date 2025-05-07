"use client"

import type React from "react"

import { createTag, deleteTag, updateTag } from "@/apis/gallary-apis"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Loader2, Plus, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Tag } from "@/types"




export function TagsManagement({
   tags,
   onTagsChange,
}: {
   tags: Tag[]
   onTagsChange: (tags: Tag[]) => void
}) {
   const [newTagName, setNewTagName] = useState("")
   const [newTagDescription, setNewTagDescription] = useState("")
   const [loading, setLoading] = useState(false)
   const [editingTag, setEditingTag] = useState<Tag | null>(null)

   // Create tag
   const handleCreateTag = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newTagName.trim()) return toast.error("Please enter a tag name")

      try {
         setLoading(true)
         const response = await createTag({
            name: newTagName.trim(),
            description: newTagDescription.trim(),
         })
         if (response?.error) {
            toast.error(response?.error || "Error while creating tag")
            return
         }

         const newTag = response?.data?.data?.tag
         if (newTag) {
            onTagsChange([...tags, newTag])
            setNewTagName("")
            setNewTagDescription("")
            toast.success("Tag created successfully")
         }
      } catch (error) {
         console.error(error)
         toast.error("Failed to create tag")
      } finally {
         setLoading(false)
      }
   }

   // Update tag
   const handleUpdateTag = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editingTag || !editingTag.name.trim()) return toast.error("Please enter a tag name")

      try {
         setLoading(true)
         const response = await updateTag(editingTag.id, {
            name: editingTag.name.trim(),
            description: editingTag.description?.trim() || null,
         })
         if (response?.error) {
            toast.error(response?.error || "Error while updating tag")
            return;
         }
         const updatedTag = response?.data?.data?.tag
         if (updatedTag) {
            onTagsChange(tags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag)))
            toast.success("Tag updated successfully")
         }
      } catch (error) {
         console.error(error)
         toast.error("Failed to update tag")
      } finally {
         setEditingTag(null)
         setLoading(false)
      }
   }

   // Delete tag
   const handleDeleteTag = async (id: number) => {
      if (!confirm("Are you sure you want to delete this tag?")) return

      try {
         setLoading(true)
         const isDeleted = await deleteTag(id)
         if (isDeleted?.error) {
            toast.error(isDeleted?.error || "Error while deleting tag")
         }
         onTagsChange(tags.filter((tag) => tag.id !== id))
         toast.success("Tag deleted successfully")
      } catch (error) {
         console.error(error)
         toast.error("Failed to delete tag")
      } finally {
         setLoading(false)
      }
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Manage Tags</CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
            {/* Create Tag Form */}
            <form onSubmit={handleCreateTag} className="space-y-4">
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                     <Label htmlFor="tag-name">Tag Name</Label>
                     <Input
                        id="tag-name"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Enter tag name"
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="tag-description">Description (Optional)</Label>
                     <Input
                        id="tag-description"
                        value={newTagDescription}
                        onChange={(e) => setNewTagDescription(e.target.value)}
                        placeholder="Enter tag description"
                     />
                  </div>
               </div>
               <Button type="submit" disabled={loading}>
                  {loading ? (
                     <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                     </>
                  ) : (
                     <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Tag
                     </>
                  )}
               </Button>
            </form>

            {/* Existing Tags */}
            <div className="space-y-2">
               <h3 className="text-lg font-medium">Existing Tags</h3>
               {tags.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                     No tags found. Create some tags to get started.
                  </div>
               ) : (
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Name</TableHead>
                           <TableHead>Description</TableHead>
                           <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {tags.map((tag) => (
                           <TableRow key={tag.id}>
                              <TableCell className="font-medium">{tag.name}</TableCell>
                              <TableCell>{tag.description || "-"}</TableCell>
                              <TableCell>
                                 <div className="flex gap-2">
                                    {/* Edit Dialog */}
                                    <Dialog
                                       open={editingTag?.id === tag.id}
                                       onOpenChange={(open) => setEditingTag(open ? tag : null)}
                                    >
                                       <DialogTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                             <Edit className="h-4 w-4" />
                                             <span className="sr-only">Edit</span>
                                          </Button>
                                       </DialogTrigger>
                                       <DialogContent>
                                          <DialogHeader>
                                             <DialogTitle>Edit Tag</DialogTitle>
                                          </DialogHeader>
                                          <form onSubmit={handleUpdateTag} className="space-y-4">
                                             <div className="space-y-2">
                                                <Label htmlFor="edit-tag-name">Tag Name</Label>
                                                <Input
                                                   id="edit-tag-name"
                                                   value={editingTag?.name || ""}
                                                   onChange={(e) =>
                                                      setEditingTag({ ...editingTag!, name: e.target.value })
                                                   }
                                                   required
                                                />
                                             </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="edit-tag-description">Description</Label>
                                                <Input
                                                   id="edit-tag-description"
                                                   value={editingTag?.description || ""}
                                                   onChange={(e) =>
                                                      setEditingTag({ ...editingTag!, description: e.target.value })
                                                   }
                                                />
                                             </div>
                                             <DialogFooter>
                                                <DialogClose asChild>
                                                   <Button type="button" variant="outline">
                                                      Cancel
                                                   </Button>
                                                </DialogClose>
                                                <Button type="submit" disabled={loading}>
                                                   {loading ? (
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
                                       </DialogContent>
                                    </Dialog>

                                    {/* Delete Button */}
                                    <Button
                                       variant="ghost"
                                       size="icon"
                                       onClick={() => handleDeleteTag(tag.id)}
                                       disabled={loading}
                                    >
                                       <Trash className="h-4 w-4 text-destructive" />
                                       <span className="sr-only">Delete</span>
                                    </Button>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               )}
            </div>
         </CardContent>
      </Card>
   )
}