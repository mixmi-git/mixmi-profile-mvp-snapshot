import { useState, useCallback } from "react"

// Types
export interface SocialLink {
  platform: string
  url: string
}

export interface SectionVisibility {
  projects: boolean
  media: boolean
  shop: boolean
}

export interface Profile {
  name: string
  title: string
  bio: string
  image: string
  socialLinks: SocialLink[]
  sectionVisibility: SectionVisibility
  spotlightDescription: string
  hasEditedProfile: boolean
}

interface FormError {
  message: string
  isValid: boolean
}

export interface FormErrors {
  name: FormError
  title: FormError
  bio: FormError
  socialLinks: FormError[]
}

const defaultProfile: Profile = {
  name: "Your Name",
  title: "What you do",
  bio: "Tell your story here...",
  image: "/images/placeholder-profile.jpg",
  socialLinks: [
    { platform: "youtube", url: "" },
    { platform: "spotify", url: "" },
    { platform: "soundcloud", url: "" },
    { platform: "instagram", url: "" }
  ],
  sectionVisibility: {
    projects: true,
    media: true,
    shop: true
  },
  spotlightDescription: "",
  hasEditedProfile: false
}

export function useProfileState() {
  // Profile state
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  
  // Form errors state
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: { message: '', isValid: true },
    title: { message: '', isValid: true },
    bio: { message: '', isValid: true },
    socialLinks: []
  })

  // Handle profile changes
  const handleProfileChange = useCallback((field: keyof Profile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
      hasEditedProfile: field === 'hasEditedProfile' ? value : true
    }))
  }, [])

  // Handle section visibility toggle
  const handleSectionVisibilityToggle = useCallback((section: keyof SectionVisibility) => {
    setProfile(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section]
      },
      hasEditedProfile: true
    }))
  }, [])

  // Handle social link change
  const handleSocialLinkChange = useCallback((index: number, field: keyof SocialLink, value: string) => {
    setProfile(prev => {
      const updatedLinks = [...prev.socialLinks]
      updatedLinks[index] = {
        ...updatedLinks[index],
        [field]: value
      }
      return {
        ...prev,
        socialLinks: updatedLinks,
        hasEditedProfile: true
      }
    })
  }, [])

  // Reset profile to default
  const resetProfile = useCallback(() => {
    setProfile({
      ...defaultProfile,
      hasEditedProfile: false
    })
    setFormErrors({
      name: { message: '', isValid: true },
      title: { message: '', isValid: true },
      bio: { message: '', isValid: true },
      socialLinks: []
    })
  }, [])

  return {
    profile,
    setProfile,
    formErrors,
    setFormErrors,
    handleProfileChange,
    handleSectionVisibilityToggle,
    handleSocialLinkChange,
    resetProfile,
    defaultProfile
  }
} 