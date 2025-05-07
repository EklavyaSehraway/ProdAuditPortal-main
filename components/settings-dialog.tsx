"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [w1WapeThreshold, setW1WapeThreshold] = useState(5)
  const [w3WapeThreshold, setW3WapeThreshold] = useState(10)
  const [w1CapAskUtilThreshold, setW1CapAskUtilThreshold] = useState(85)
  const [cohThreshold, setCohThreshold] = useState(20)

  const handleSave = () => {
    // Save the settings to your backend/state management
    toast({
      title: "Settings saved",
      description: "Your threshold settings have been saved successfully.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Threshold Settings</DialogTitle>
          <DialogDescription>
            Adjust the threshold values for various metrics.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="w1-wape-threshold">W-1 WAPE Threshold</Label>
              <span className="text-sm font-medium">{w1WapeThreshold}%</span>
            </div>
            <Slider
              id="w1-wape-threshold"
              value={[w1WapeThreshold]}
              min={0}
              max={20}
              step={0.5}
              onValueChange={(value) => setW1WapeThreshold(value[0])}
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="w3-wape-threshold">W-3 WAPE Threshold</Label>
              <span className="text-sm font-medium">{w3WapeThreshold}%</span>
            </div>
            <Slider
              id="w3-wape-threshold"
              value={[w3WapeThreshold]}
              min={0}
              max={25}
              step={0.5}
              onValueChange={(value) => setW3WapeThreshold(value[0])}
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="w1-cap-ask-util-threshold">W-1 Cap Ask Util Threshold</Label>
              <span className="text-sm font-medium">{w1CapAskUtilThreshold}%</span>
            </div>
            <Slider
              id="w1-cap-ask-util-threshold"
              value={[w1CapAskUtilThreshold]}
              min={50}
              max={100}
              step={1}
              onValueChange={(value) => setW1CapAskUtilThreshold(value[0])}
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="coh-threshold">COH Threshold</Label>
              <span className="text-sm font-medium">{cohThreshold}%</span>
            </div>
            <Slider
              id="coh-threshold"
              value={[cohThreshold]}
              min={0}
              max={50}
              step={1}
              onValueChange={(value) => setCohThreshold(value[0])}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 