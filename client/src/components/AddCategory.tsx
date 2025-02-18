"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from 'axios';
import { Loader2, Plus } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Category name is required.",
  }),
});

interface AddCategoryProps {
  mutate?: () => void;
}
const AddCategory :React.FC<AddCategoryProps>= ({mutate}) => {
  const [isOpen,setIsOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  
  const onSubmit = async(values:z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transaction`, {
        ...values,
      });
      mutate?.();
      setIsOpen(false);
      form.reset();
    } catch (err) {
      console.error("Error deleting transaction:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
      <Button variant="outline" className=''>
          Add Category <Plus className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                         <Button type="submit" disabled={isSaving}>
                           {isSaving ? (
                             <div className="flex items-center gap-2">
                               <Loader2 className="w-4 h-4 animate-spin" />
                               Saving...
                             </div>
                           ) : (
                             "Save"
                           )}
                         </Button>
                         <Button variant="outline" onClick={() => setIsOpen(false)}>
                           Cancel
                         </Button>
                       </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;