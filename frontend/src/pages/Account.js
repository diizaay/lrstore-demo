import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { User, Mail, Phone, Lock, Package } from "lucide-react";
import { toast } from "../hooks/use-toast";
import { registerUser, loginUser } from "../services/api";

const Account = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  /* ---------------------------- LOGIN --------------------------- */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        email: loginData.email,
        password: loginData.password,
      });

      toast({
        title: "Login efetuado!",
        description:
          response?.message || "Login realizado com sucesso.",
      });

      setLoginData({ email: "", password: "" });
    } catch (err) {
      const backendMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Erro ao entrar. Verifique os dados.";

      toast({
        title: "Erro no login",
        description: backendMsg,
        variant: "destructive",
      });
    }
  };

  /* ---------------------------- REGISTRO ------------------------- */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name: registerData.name,
      full_name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      phone_number: registerData.phone,
      password: registerData.password,
    };

    try {
      const res = await registerUser(payload);

      toast({
        title: "Conta criada com sucesso!",
        description:
          res?.message || "Agora você pode entrar na sua conta.",
      });

      // LOGIN AUTOMÁTICO
      try {
        await loginUser({
          email: registerData.email,
          password: registerData.password,
        });
      } catch {}

      setRegisterData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("[Account] erro no registro:", error);

      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "Não foi possível criar a conta.";

      toast({
        title: "Erro no registro",
        description: backendMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* TITLE */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Minha Conta
            </span>
          </h1>
          <p className="text-gray-600">
            Entre ou crie sua conta para continuar
          </p>
        </div>

        {/* TABS */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>

          {/* ================= LOGIN ================= */}
          <TabsContent value="login">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Entrar na Sua Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* email */}
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* password */}
                  <div>
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-6 rounded-full"
                  >
                    Entrar
                  </Button>

                  <div className="text-center">
                    <a
                      href="#"
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= REGISTER ================= */}
          <TabsContent value="register">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Criar Nova Conta
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Nome */}
                  <div>
                    <Label htmlFor="reg-name">Nome Completo</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="reg-name"
                        type="text"
                        placeholder="Seu nome"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            name: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div>
                    <Label htmlFor="reg-phone">Telefone</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="reg-phone"
                        type="tel"
                        placeholder="+244 9xx xxx xxx"
                        value={registerData.phone}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            phone: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div>
                    <Label htmlFor="reg-pass">Senha</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="reg-pass"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm senha */}
                  <div>
                    <Label htmlFor="reg-confirm">Confirmar Senha</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="reg-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-6 rounded-full"
                  >
                    Criar Conta
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ===================== ORDERS (mock visual) ===================== */}
        <Card className="mt-8 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Meus Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Entre na sua conta para ver seus pedidos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;
