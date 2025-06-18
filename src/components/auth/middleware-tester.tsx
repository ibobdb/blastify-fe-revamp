'use client';

import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getToken, getRefreshToken } from '@/utils/auth';
import { isPublicRoute } from '@/utils/route-protection';

/**
 * Component to test and display middleware protection status
 */
export function MiddlewareProtectionTester() {
  // Get current path and auth status
  const pathname = usePathname();
  const accessToken = getToken();
  const refreshToken = getRefreshToken();
  const isPublic = isPublicRoute(pathname);

  return (
    <Card className="shadow-md mb-6">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl flex items-center gap-2">
          Middleware Protection Status
          {isPublic ? (
            <Badge variant="outline">Public Route</Badge>
          ) : (
            <Badge variant="default">Protected Route</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="font-medium mb-2">Current Path</h3>
          <pre className="bg-muted p-2 rounded text-sm">{pathname}</pre>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Access Token</h3>
            <Badge variant={accessToken ? 'default' : 'outline'}>
              {accessToken ? 'Present' : 'Missing'}
            </Badge>
          </div>

          <div>
            <h3 className="font-medium mb-2">Refresh Token</h3>
            <Badge variant={refreshToken ? 'default' : 'outline'}>
              {refreshToken ? 'Present' : 'Missing'}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Protection Status</h3>
          {isPublic ? (
            <Badge variant="outline">Public - No Authentication Required</Badge>
          ) : accessToken ? (
            <Badge variant="default">Protected - Authenticated Access</Badge>
          ) : (
            <Badge variant="destructive">
              Protected - Access Denied (Middleware will redirect)
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
