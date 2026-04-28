export interface User {
  ID: string
  Email: string
  FullName: string
  Role: "customer" | "technician"
  PhoneNumber?: string
  ProfilePictureURL?: string
}

export interface Device {
  ID: string
  id?: string
  BrandName: string
  Category: string
  WeightInKg: number
  total_repairs?: number
  CreatedAt: string
  UpdatedAt: string
}

export interface Order {
  ID: string
  id?: string
  CustomerID: string
  TechnicianID?: string
  DeviceID?: string
  DeviceCategory: string
  ProblemDescription: string
  Status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  CustomerLatitude?: number
  CustomerLongitude?: number
  TechnicianLatitude?: number
  TechnicianLongitude?: number
  ServiceFee?: number
  TotalFee?: number
  NetTechnicianFee?: number
  PhotoProofURL?: string
  EWasteSavedKg?: number
  IsReviewed?: boolean
  is_reviewed?: boolean
  CreatedAt: string
  UpdatedAt: string
  Technician?: {
    ID: string
    Rating?: number
    Specialization?: string
    ExperienceYears?: number
    Latitude?: number
    Longitude?: number
    latitude?: number
    longitude?: number
    User?: {
      FullName?: string
      ProfilePictureURL?: string
      PhoneNumber?: string
    }
    FullName?: string
    ProfilePictureURL?: string
    PhoneNumber?: string
  }
  Customer?: {
    ID: string
    FullName: string
    ProfilePictureURL?: string
    PhoneNumber?: string
  }
}
