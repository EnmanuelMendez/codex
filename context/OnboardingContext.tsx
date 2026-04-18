import React, { createContext, useContext, useState } from "react";

export type OnboardingData = {
  age?: number;
  weight?: string;
  height?: string;
  unitSystem?: "Métrico" | "Imperial";
  gender?: "Hombre" | "Mujer";
  goal?: string;
};

type OnboardingContextType = {
  data: OnboardingData;
  updateData: (values: Partial<OnboardingData>) => void;
  resetData: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<OnboardingData>({});

  const updateData = (values: Partial<OnboardingData>) => {
    setData((prev) => ({
      ...prev,
      ...values,
    }));
  };

  const resetData = () => {
    setData({});
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }

  return context;
}
