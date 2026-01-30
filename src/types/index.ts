export type MaterialType = 'concrete' | 'asphalt' | 'soil' | 'steel';

export interface BaseSample {
  id: string;
  materialType: MaterialType;
  contractorName: string;
  technicianName: string;
  createdAt: string;
  files: FileAttachment[];
}

export interface ConcreteSample extends BaseSample {
  materialType: 'concrete';
  pouringDate: string;
  pouringType: string;
  requiredStrength: string;
  crushDate7Days: string;
  crushDate28Days: string;
}

export interface AsphaltSample extends BaseSample {
  materialType: 'asphalt';
  mixType: 'B' | 'C';
  asphaltPlant: string;
}

export interface SoilSample extends BaseSample {
  materialType: 'soil';
  siteLocation: string;
  requiredTests: string;
}

export interface SteelSample extends BaseSample {
  materialType: 'steel';
  steelGrade: string;
  diameter: string;
  supplier: string;
}

export type Sample = ConcreteSample | AsphaltSample | SoilSample | SteelSample;

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
}
