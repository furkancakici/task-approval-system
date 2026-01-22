import i18n from '@repo/i18n';

// Using any for schema to avoid strict type mismatch between monorepo packages
export const zodResolver = (schema: any) => (values: any) => {
  const result = schema.safeParse(values);
  
  if (result.success) {
    return {};
  }

  const errors: Record<string, string> = {};
  
  // Cast error to any to access errors property safely
  (result.error as any).errors.forEach((error: any) => {
    const path = error.path.join('.');
    if (!errors[path]) {
      // Translate the message if it's a key
      errors[path] = i18n.t(error.message);
    }
  });

  return errors;
};
