'use client';

import { useState } from 'react';
import { useAuth } from '@/context';
import { MainPageLayout } from '@/components/dashboard/main-page-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Key,
  Activity,
} from 'lucide-react';
import { useAlert } from '@/hooks';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .optional(),
  confirmPassword: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { showSuccess, showError, AlertComponent } = useAlert();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Here you would typically call an API to update the profile
      console.log('Profile update data:', data);

      showSuccess(
        'Profile Updated',
        'Your profile has been successfully updated.'
      );

      setIsEditing(false);
      setIsChangingPassword(false);
    } catch (error) {
      showError('Update Failed', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  return (
    <MainPageLayout
      title="Profile Settings"
      description="Manage your account settings and preferences"
      actionButtons={
        !isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-6">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account details and personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-lg">
                        {user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{user?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {user?.role}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Profile Form */}
                <Form {...form}>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  className="pl-10"
                                  placeholder="Enter your full name"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  className="pl-10"
                                  placeholder="Enter your email"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Account Type</Label>
                        <div className="mt-2">
                          <Badge variant="outline" className="gap-2">
                            <Shield className="h-3 w-3" />
                            {user?.role || 'User'}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label>Member Since</Label>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          January 2024
                        </div>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className="gap-2"
                  >
                    <Key className="h-4 w-4" />
                    Change Password
                  </Button>
                </div>

                {isChangingPassword && (
                  <Form {...form}>
                    <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Enter current password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Enter new password"
                              />
                            </FormControl>
                            <FormDescription>
                              Password must be at least 8 characters long.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Confirm new password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={form.handleSubmit(onSubmit)}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Update Password
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsChangingPassword(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Security Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Two-Factor Authentication
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Badge variant="destructive">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Login Notifications
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Get notified when someone signs into your account
                        </p>
                      </div>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent account activity and login history.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: 'Signed in',
                      device: 'Chrome on Windows',
                      time: '2 hours ago',
                      location: 'Jakarta, Indonesia',
                    },
                    {
                      action: 'Profile updated',
                      device: 'Chrome on Windows',
                      time: '1 day ago',
                      location: 'Jakarta, Indonesia',
                    },
                    {
                      action: 'Password changed',
                      device: 'Chrome on Windows',
                      time: '3 days ago',
                      location: 'Jakarta, Indonesia',
                    },
                    {
                      action: 'Signed in',
                      device: 'Safari on iPhone',
                      time: '1 week ago',
                      location: 'Jakarta, Indonesia',
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.device} • {activity.location}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {AlertComponent}
    </MainPageLayout>
  );
}
