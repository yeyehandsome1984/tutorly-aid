import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TutorDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tutor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your tutor dashboard
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Your tutor management features will appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default TutorDashboard;
