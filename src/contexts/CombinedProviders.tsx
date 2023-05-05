// src/contexts/CombinedProviders.tsx
import React, {ReactNode} from "react";
import InputFormProvider from "./InputFormContext";
import CourierProvider from "./CourierContext";

const providers = [InputFormProvider, CourierProvider];

interface CombinedProvidersProps {
  children: ReactNode;
}

const CombinedProviders: React.FC<CombinedProvidersProps> = ({children}) => {
  return (
    <>
      {providers.reduceRight(
        (child, Provider) => (
          <Provider>{child}</Provider>
        ),
        children
      )}
    </>
  );
};

export default CombinedProviders;
