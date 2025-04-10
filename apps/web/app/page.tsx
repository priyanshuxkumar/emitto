import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Check } from "lucide-react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { irBlack } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { sampleCode } from "@/helper/sampleCode";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <div>
      <div>
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative">
              <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

              <div className="text-center max-w-4xl mx-auto mb-12">
                <h1 className="pt-3 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-400 to-gray-50">
                  Effortless Email & Notification API for Developers
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Send transactional emails, SMS, and push notifications
                  seamlessly with a single API. Built for speed, reliability,
                  and scalability.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={"/signup"}>
                    <Button
                      size="lg"
                      className="rounded-full h-12 px-8 text-base cursor-pointer"
                    >
                      Get Started
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto max-w-5xl">
                <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                  <Image
                    src="https://cdn.dribbble.com/userupload/12302729/file/original-fa372845e394ee85bebe0389b9d86871.png?resize=1504x1128&vertical=center"
                    width={1280}
                    height={720}
                    alt="SaaSify dashboard"
                    className="w-full h-auto"
                    priority
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
                <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

            <div className="container mx-auto px-4 md:px-6 relative">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                <Badge
                  className="rounded-full px-4 py-1.5 text-sm font-medium"
                  variant="secondary"
                >
                  How It Works
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Seamless Integration, Ready in Minutes
                </h2>
                <p className="max-w-[800px] text-muted-foreground md:text-lg">
                  Add powerful email, SMS, and push notifications to your
                  project with just a few lines of code. Simple, fast, and
                  reliable.
                </p>
              </div>
              <div className="max-w-5xl mx-auto border rounded-2xl">
                <SyntaxHighlighter
                  language="javascript"
                  style={irBlack}
                  customStyle={{
                    height: "70vh",
                    padding: "25px",
                    fontSize: "15px",
                    backgroundColor: "black",
                    borderRadius: "16px",
                  }}
                  showLineNumbers
                  wrapLongLines={true}
                >
                  {sampleCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section
            id="pricing"
            className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

            <div className="container mx-auto px-4 md:px-6 relative">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <Badge
                  className="rounded-full px-4 py-1.5 text-sm font-medium"
                  variant="secondary"
                >
                  Pricing
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[800px] text-muted-foreground md:text-lg">
                  Choose the plan that&apos; right for your business.
                </p>
              </div>

              <div className="mx-auto max-w-5xl">
                <Tabs defaultValue="monthly" className="w-full">
                  <div className="flex justify-center mb-8">
                    <TabsList className="rounded-full p-1">
                      <TabsTrigger
                        value="monthly"
                        className="rounded-full px-6"
                      >
                        Monthly
                      </TabsTrigger>
                      <TabsTrigger
                        value="annually"
                        className="rounded-full px-6"
                      >
                        Annually (Save 20%)
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="monthly">
                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                      {[
                        {
                          name: "Starter",
                          price: "$29",
                          description: "50,000 emails/mo.",
                          features: [
                            "No daily limit",
                            "Basic analytics",
                            "5GB storage",
                            "Email support",
                          ],
                          cta: "Get started",
                        },
                        {
                          name: "Professional",
                          price: "$79",
                          description: "100,000 emails/mo.",
                          features: [
                            "No daily limit",
                            "Advanced analytics",
                            "25GB storage",
                            "Priority email support",
                            "API access",
                          ],
                          cta: "Get started",
                          popular: true,
                        },
                        {
                          name: "Enterprise",
                          price: "$199",
                          description:
                            "For large organizations with complex needs.",
                          features: [
                            "Unlimited team members",
                            "Custom analytics",
                            "Unlimited storage",
                            "24/7 phone & email support",
                            "Advanced API access",
                            "Custom integrations",
                          ],
                          cta: "Get started",
                        },
                      ].map((plan, i) => (
                        <div key={i}>
                          <Card
                            className={`relative overflow-hidden h-full ${plan.popular ? "border-primary shadow-lg" : "border-border/40 shadow-md"} bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                          >
                            {plan.popular && (
                              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                                Most Popular
                              </div>
                            )}
                            <CardContent className="p-6 flex flex-col h-full">
                              <h3 className="text-2xl font-bold">
                                {plan.name}
                              </h3>
                              <div className="flex items-baseline mt-4">
                                <span className="text-4xl font-bold">
                                  {plan.price}
                                </span>
                                <span className="text-muted-foreground ml-1">
                                  /month
                                </span>
                              </div>
                              <p className="text-muted-foreground mt-2">
                                {plan.description}
                              </p>
                              <ul className="space-y-3 my-6 flex-grow">
                                {plan.features.map((feature, j) => (
                                  <li key={j} className="flex items-center">
                                    <Check className="mr-2 size-4 text-primary" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                              <Button
                                className={`w-full mt-auto rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"}`}
                                variant={plan.popular ? "default" : "outline"}
                              >
                                {plan.cta}
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="annually">
                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                      {[
                        {
                          name: "Starter",
                          price: "$23",
                          description: "Perfect for small teams and startups.",
                          features: [
                            "Up to 5 team members",
                            "Basic analytics",
                            "5GB storage",
                            "Email support",
                          ],
                          cta: "Start Free Trial",
                        },
                        {
                          name: "Professional",
                          price: "$63",
                          description: "Ideal for growing businesses.",
                          features: [
                            "Up to 20 team members",
                            "Advanced analytics",
                            "25GB storage",
                            "Priority email support",
                            "API access",
                          ],
                          cta: "Start Free Trial",
                          popular: true,
                        },
                        {
                          name: "Enterprise",
                          price: "$159",
                          description:
                            "For large organizations with complex needs.",
                          features: [
                            "Unlimited team members",
                            "Custom analytics",
                            "Unlimited storage",
                            "24/7 phone & email support",
                            "Advanced API access",
                            "Custom integrations",
                          ],
                          cta: "Contact Sales",
                        },
                      ].map((plan, i) => (
                        <div key={i}>
                          <Card
                            className={`relative overflow-hidden h-full ${plan.popular ? "border-primary shadow-lg" : "border-border/40 shadow-md"} bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                          >
                            {plan.popular && (
                              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                                Most Popular
                              </div>
                            )}
                            <CardContent className="p-6 flex flex-col h-full">
                              <h3 className="text-2xl font-bold">
                                {plan.name}
                              </h3>
                              <div className="flex items-baseline mt-4">
                                <span className="text-4xl font-bold">
                                  {plan.price}
                                </span>
                                <span className="text-muted-foreground ml-1">
                                  /month
                                </span>
                              </div>
                              <p className="text-muted-foreground mt-2">
                                {plan.description}
                              </p>
                              <ul className="space-y-3 my-6 flex-grow">
                                {plan.features.map((feature, j) => (
                                  <li key={j} className="flex items-center">
                                    <Check className="mr-2 size-4 text-primary" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                              <Button
                                className={`w-full mt-auto rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"}`}
                                variant={plan.popular ? "default" : "outline"}
                              >
                                {plan.cta}
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 md:px-6 relative">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  Power Up Your Notifications Instantly
                </h2>
                <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                  Deliver emails, SMS, and push notifications effortlessly. Join
                  thousands of developers automating communication with Emitto.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Link href={"/signup"}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white/10 hover:text-black cursor-pointer"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Footer  */}
          <Footer/>
        </main>
      </div>
    </div>
  );
}
