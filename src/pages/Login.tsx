import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/context/userAuthContext";
import { UserLogIn } from "@/types";
import login2 from "@/assets/images/login2.jpg"
import login5 from "@/assets/images/login5.jpg"
import login7 from "@/assets/images/login7.jpg"
import login9 from "@/assets/images/login9.jpg"
import { Label } from "@radix-ui/react-label";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "@/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface ILoginProps {}
const initialValue: UserLogIn = {
  email: "",
  password: "",
};

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const { googleSignIn, logIn } = useUserAuth();
  const navigate = useNavigate();
  const [userLogInInfo, setuserLogInInfo] = React.useState<UserLogIn>(initialValue);

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      const userCredential = await googleSignIn();
      const user = userCredential.user;

      const userRef = doc(db,"users",user.uid);
      const userSnap = await getDoc(userRef);

      if(!userSnap.exists()){
        await setDoc(userRef, {
          userId: user.uid,
          email: user.email,
          username: '',
          bio: '',
          photo: '',
          posts: [],
        });
      }
      navigate("/");
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("The user info is : ", userLogInInfo);
      await logIn(userLogInInfo.email, userLogInInfo.password);
      navigate("/");
    } catch (error) {
      console.log("Error : ", error);
    }
  };
  return (
    <div className="bg-slate-800 w-full h-screen">
      <div className="container mx-auto p-6 flex h-full">
        <div className="flex justify-center items-center w-full">
          <div className="p-6 w-2/3 hidden lg:block">
            <div className="grid grid-cols-2 gap-2">
              <img
                className=" w-2/3 h-auto aspect-video rounded-3xl place-self-end"
                src={login5}
              />
              <img
                className=" w-2/4 h-auto aspect-auto rounded-3xl"
                src={login2}
              />
              <img
                className=" w-2/4 h-auto aspect-auto rounded-3xl place-self-end"
                src={login7}
              />
              <img
                className=" w-2/3 h-auto aspect-video rounded-3xl"
                src={login9}
              />
            </div>
          </div>
          <div className="max-w-sm rounded-xl border bg-card text-card-foreground shadow-sm">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center mb-4">
                    PhotoGram
                  </CardTitle>
                  <CardDescription>
                    Sign in with google
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid">
                    <Button variant="outline" onClick={handleGoogleSignIn}>
                      <Icons.google className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email....."
                      value={userLogInInfo.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setuserLogInInfo({
                          ...userLogInInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={userLogInInfo.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setuserLogInInfo({
                          ...userLogInInfo,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button className="w-full" type="submit">
                    Login
                  </Button>
                  <p className="mt-3 text-sm text-center">
                    Don't have an account ? <Link to="/signup">Sign up</Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;