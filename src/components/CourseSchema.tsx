interface Course {
  name: string;
  description: string | null;
  keywords?: string[] | null;
}

interface CourseSchemaProps {
  courses: Course[];
}

const CourseSchema = ({ courses }: CourseSchemaProps) => {
  const schemaData = courses.map((course) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.description || `Expert tuition for ${course.name} at A-Level in Singapore`,
    "provider": {
      "@type": "EducationalOrganization",
      "@id": "https://micommercestreamtuition.com/#organization",
      "name": "MI Commerce Stream Tuition",
      "sameAs": "https://micommercestreamtuition.com"
    },
    "educationalLevel": "A-Level / Junior College",
    "inLanguage": ["en", "zh"],
    "teaches": course.name,
    "availableLanguage": ["English", "Chinese (Mandarin)"],
    "courseMode": ["online", "offline"],
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": ["online", "offline"],
      "instructor": {
        "@type": "Person",
        "name": "MI Tuition Team"
      }
    },
    ...(course.keywords && course.keywords.length > 0 && {
      "keywords": course.keywords.join(", ")
    })
  }));

  return (
    <>
      {schemaData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default CourseSchema;
