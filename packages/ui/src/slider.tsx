"use client";

import React, { useEffect } from "react";
import { initMaterialWeb } from "./material-init";

export interface AppSliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  labeled?: boolean;
  ticks?: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (e: React.FormEvent<HTMLElement>) => void;
  className?: string;
  id?: string;
}

/**
 * Official Material 3 Slider Component
 * Thin typed React wrapper over @material/web custom element:
 * - md-slider
 */
export const AppSlider: React.FC<AppSliderProps> = ({
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  labeled = true,
  ticks = false,
  name,
  onChange,
  onInput,
  className = "",
  id,
}) => {
  useEffect(() => {
    initMaterialWeb();
  }, []);

  return (
    <md-slider
      value={value}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      labeled={labeled}
      ticks={ticks}
      name={name}
      id={id}
      className={`w-full ${className}`}
      onChange={onChange}
      onInput={onInput}
    />
  );
};
