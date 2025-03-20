import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProfileFields } from "../lib/validation/profileValidation";

interface ProfileFormProps {
  values: ProfileFields;
  errors: Record<keyof ProfileFields, { isValid: boolean; message: string }>;
  touched: Record<keyof ProfileFields, boolean>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof ProfileFields, value: string) => void;
  onBlur: (field: keyof ProfileFields) => void;
  onReset: () => void;
}

export function ProfileForm({
  values,
  errors,
  touched,
  isDirty,
  isValid,
  isSubmitting,
  onSubmit,
  onChange,
  onBlur,
  onReset,
}: ProfileFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name as keyof ProfileFields, e.target.value);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onBlur(e.target.name as keyof ProfileFields);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={errors.name && touched.name ? "border-red-500" : ""}
          />
          {errors.name && touched.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={values.title}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={errors.title && touched.title ? "border-red-500" : ""}
          />
          {errors.title && touched.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={values.bio}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={errors.bio && touched.bio ? "border-red-500" : ""}
          />
          {errors.bio && touched.bio && (
            <p className="text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={!isDirty || isSubmitting}
        >
          Reset
        </Button>
        <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
} 