
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TradeFormValues } from "@/schemas/tradeFormSchema";

interface TradeScreenshotFieldProps {
  form: UseFormReturn<TradeFormValues>;
  screenshotPreview: string | null;
  onScreenshotUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TradeScreenshotField({ 
  form, 
  screenshotPreview, 
  onScreenshotUpload 
}: TradeScreenshotFieldProps) {
  return (
    <FormField
      control={form.control}
      name="screenshot"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Trade Screenshot</FormLabel>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-md hover:bg-accent">
              <Camera size={20} />
              <span>Upload Screenshot</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  onScreenshotUpload(e);
                  field.onChange(e);
                }}
              />
            </label>
            {screenshotPreview && (
              <Card className="mt-2 overflow-hidden">
                <CardContent className="p-2">
                  <img
                    src={screenshotPreview}
                    alt="Trade Screenshot"
                    className="w-full h-auto max-h-64 object-contain"
                  />
                </CardContent>
              </Card>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
