import { create } from "zustand";

interface TourState {
  isActive: boolean;
  modelSelectorOpen: boolean;
  personaSelectorOpen: boolean;
  modelSelectorShowAll: boolean;
  personaSelectorShowAll: boolean;
  setTourActive: (active: boolean) => void;
  setModelSelectorOpen: (open: boolean) => void;
  setPersonaSelectorOpen: (open: boolean) => void;
  setModelSelectorShowAll: (showAll: boolean) => void;
  setPersonaSelectorShowAll: (showAll: boolean) => void;
}

export const useTourState = create<TourState>((set) => ({
  isActive: false,
  modelSelectorOpen: false,
  personaSelectorOpen: false,
  modelSelectorShowAll: false,
  personaSelectorShowAll: false,
  setTourActive: (active): void => {
    set({ isActive: active });
  },
  setModelSelectorOpen: (open): void => {
    set({ modelSelectorOpen: open });
  },
  setPersonaSelectorOpen: (open): void => {
    set({ personaSelectorOpen: open });
  },
  setModelSelectorShowAll: (showAll): void => {
    set({ modelSelectorShowAll: showAll });
  },
  setPersonaSelectorShowAll: (showAll): void => {
    set({ personaSelectorShowAll: showAll });
  },
}));
