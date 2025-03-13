import { useState, useCallback } from "react"
import { Profile, SocialLink, SectionVisibility, FormError, FormErrors } from "../types/content"

// Types
// interfaces moved to ../types/content.ts

const defaultProfile: Profile = {
  name: "Your Name",
  title: "Your Role / Title",
  bio: "Tell your story here...",
  image: "/images/placeholder.png",
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
  spotlightDescription: ""
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
      [field]: value
    }))
  }, [])

  // Handle section visibility toggle
  const handleSectionVisibilityToggle = useCallback((section: keyof SectionVisibility) => {
    setProfile(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section]
      }
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
        socialLinks: updatedLinks
      }
    })
  }, [])

  // Reset profile to default
  const resetProfile = useCallback(() => {
    setProfile(defaultProfile)
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