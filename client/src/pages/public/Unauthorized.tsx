import PageContainer from "@/components/layouts/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, HomeIcon, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="border border-muted shadow-md">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-destructive/10 rounded-full">
                  <ShieldAlert className="w-10 h-10 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl font-semibold text-destructive">
                Access Denied
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You do not have permission to view this page. Please contact your
                administrator if you think this is a mistake.
              </p>

              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>
                <Link to={"/"}>
                  <Button variant="default" className="flex items-center gap-2">
                    <HomeIcon className="w-4 h-4" />
                    Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
