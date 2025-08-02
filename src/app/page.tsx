import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/general/components/ui/tabs";
import CreateAccount from "@/general/auth/create-account";
import Login from "@/general/auth/login";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="register">
            <CreateAccount />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
