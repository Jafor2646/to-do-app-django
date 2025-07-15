import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    watch,
    reset,
    clearErrors,
    formState: { errors, isSubmitted } 
  } = useForm({
    mode: 'onSubmit', // Only validate on submit
    reValidateMode: 'onChange', // Re-validate on change after first submit
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    clearErrors(); // Clear any previous form errors
    
    console.log("Registration data:", data); // Debug log
    
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...userData } = data;
      console.log("Sending to API:", userData); // Debug log
      
      const result = await registerUser(userData);
      console.log("Registration result:", result); // Debug log
      
      if (result.success) {
        setSuccess(true);
        reset(); // Reset form on success
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        console.error("Registration error:", result.error); // Debug log
        const errorMessage = typeof result.error === 'object' 
          ? Object.entries(result.error)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('\n')
          : result.error || 'Registration failed';
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Unexpected error:", err); // Debug log
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full register-card auth-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
              <h2 className="mt-4 text-2xl font-bold text-white">Registration Successful!</h2>
              <p className="mt-2 text-gray-200">
                Your account has been created successfully. Redirecting to login...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">To-Do App</h1>
          <p className="mt-2 text-black">Create your account to get started.</p>
        </div>
        
        <Card className="register-card auth-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <UserPlus className="w-5 h-5 text-white" />
              Sign Up
            </CardTitle>
            <CardDescription className="text-gray-200">
              Create a new account to start managing your tasks
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="First Name"
                    {...register("first_name", { 
                      required: "First name is required" 
                    })}
                  />
                  {isSubmitted && errors.first_name && (
                    <p className="text-sm text-red-400">{errors.first_name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Last Name"
                    {...register("last_name", { 
                      required: "Last name is required" 
                    })}
                  />
                  {isSubmitted && errors.last_name && (
                    <p className="text-sm text-red-400">{errors.last_name.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  {...register("username", { 
                    required: "Username is required",
                    minLength: { value: 3, message: "Username must be at least 3 characters" },
                    pattern: { 
                      value: /^[a-zA-Z0-9_]+$/, 
                      message: "Username can only contain letters, numbers, and underscores" 
                    }
                  })}
                />
                {isSubmitted && errors.username && (
                  <p className="text-sm text-red-400">{errors.username.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { 
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                      message: "Invalid email address" 
                    }
                  })}
                />
                {isSubmitted && errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                      }
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
                {isSubmitted && errors.password && (
                  <p className="text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: value => value === password || "Passwords do not match"
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
                {isSubmitted && errors.confirmPassword && (
                  <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-black" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              
              <p className="text-sm text-center" style={{ color: 'black !important' }}>
                <span style={{ color: 'black !important' }}>Already have an account?</span>{" "}
                <Link 
                  to="/login" 
                  className="font-medium underline"
                  style={{ color: 'black !important', textDecorationColor: 'black !important' }}
                  onMouseEnter={(e) => e.target.style.setProperty('color', '#374151', 'important')}
                  onMouseLeave={(e) => e.target.style.setProperty('color', 'black', 'important')}
                >
                  Sign in here
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}