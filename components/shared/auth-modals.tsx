import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserType = "booster" | "client";

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loginType: UserType;
  onLoginTypeChange: (type: UserType) => void;
  onSwitchToRegister?: () => void;
  overlayClassName?: string;
  panelClassName?: string;
};

export function AuthLoginModal({
  open,
  onOpenChange,
  loginType,
  onLoginTypeChange,
  onSwitchToRegister,
  overlayClassName = "modal-overlay-enter fixed inset-0 z-[80] flex items-center justify-center bg-black/65 px-4",
  panelClassName = "modal-panel-enter ghost-border w-full max-w-lg rounded-2xl border border-outline/30 bg-surface-container p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]",
}: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className={overlayClassName} />
      <DialogContent className={`!left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 ${panelClassName}`}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-headline text-3xl font-bold tracking-tight text-primary-fixed">Welcome Back</h3>
            <p className="mt-2 text-sm text-on-surface-variant">Sign in as a booster or client to continue.</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-surface-dim p-1">
          <Button
            type="button"
            variant="tab"
            size="sm"
            data-state={loginType === "booster" ? "active" : "inactive"}
            onClick={() => onLoginTypeChange("booster")}
            className="rounded-md"
          >
            Booster Login
          </Button>
          <Button
            type="button"
            variant="tab"
            size="sm"
            data-state={loginType === "client" ? "active" : "inactive"}
            onClick={() => onLoginTypeChange("client")}
            className="rounded-md"
          >
            Client Login
          </Button>
        </div>

        <form className="space-y-4">
          <div>
            <Label>{loginType === "booster" ? "Booster Email" : "Client Email"}</Label>
            <Input
              type="email"
              placeholder={loginType === "booster" ? "booster@email.com" : "client@email.com"}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" placeholder="Enter your password" />
          </div>

          <Button type="button" variant="primary" size="md" className="mt-2 w-full">
            {loginType === "booster" ? "Login as Booster" : "Login as Client"}
          </Button>
        </form>

        {onSwitchToRegister ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 font-semibold text-secondary hover:bg-transparent hover:text-primary"
            >
              Forgot password?
            </Button>
            <div className="text-on-surface-variant">
              If you&apos;re new here,
              <Button
                type="button"
                onClick={onSwitchToRegister}
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 font-semibold text-primary hover:bg-transparent hover:text-primary-fixed"
              >
                Register
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

type RegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registerType: UserType;
  onRegisterTypeChange: (type: UserType) => void;
  onOpenTerms: () => void;
  panelClassName?: string;
};

export function AuthRegisterModal({
  open,
  onOpenChange,
  registerType,
  onRegisterTypeChange,
  onOpenTerms,
  panelClassName = "modal-panel-enter ghost-border w-full max-w-2xl rounded-2xl border border-outline/30 bg-surface-container p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]",
}: RegisterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 z-[85] flex items-center justify-center bg-black/65 px-4 py-6" />
      <DialogContent className={`!left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 ${panelClassName}`}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-headline text-3xl font-bold tracking-tight text-primary-fixed">
              {registerType === "booster" ? "Booster Inscription Form" : "Client Registration Form"}
            </h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              {registerType === "booster"
                ? "Fill your details to request a booster account."
                : "Create your client account to hire top-rated boosters."}
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-surface-dim p-1">
          <Button
            type="button"
            variant="tab"
            size="sm"
            data-state={registerType === "booster" ? "active" : "inactive"}
            onClick={() => onRegisterTypeChange("booster")}
            className="rounded-md data-[state=active]:shadow-[0_8px_30px_-10px_rgba(20,214,255,0.6)]"
          >
            Booster Register
          </Button>
          <Button
            type="button"
            variant="tab"
            size="sm"
            data-state={registerType === "client" ? "active" : "inactive"}
            onClick={() => onRegisterTypeChange("client")}
            className="rounded-md data-[state=active]:shadow-[0_8px_30px_-10px_rgba(20,214,255,0.6)]"
          >
            Client Register
          </Button>
        </div>

        <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {registerType === "booster" ? (
            <div>
              <Label>Alias</Label>
              <Input type="text" placeholder="Your alias" />
            </div>
          ) : null}

          <div>
            <Label>Username</Label>
            <Input type="text" placeholder="Your username" />
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="you@email.com" />
          </div>

          <div>
            <Label>Country Of Origin</Label>
            <Input type="text" placeholder="Country" />
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" placeholder="Create password" />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="Confirm password" />
          </div>

          <div className="md:col-span-2">
            <div className="rounded-md border border-outline/20 bg-surface-dim/50 px-4 py-3 text-sm text-on-surface-variant">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-outline/40 bg-transparent accent-primary"
                />
                <span>
                  I accept the
                  <Button
                    type="button"
                    onClick={onOpenTerms}
                    variant="ghost"
                    size="sm"
                    className="mx-1 inline-block h-auto p-0 font-bold text-primary underline decoration-primary/70 underline-offset-4 hover:bg-transparent hover:text-primary-fixed"
                  >
                    Terms and Conditions
                  </Button>
                  and confirm that my registration information is accurate.
                </span>
              </label>
            </div>
          </div>

          <div className="mt-2 md:col-span-2">
            <Button type="button" variant="primary" size="md" className="w-full">
              {registerType === "booster" ? "Submit Booster Registration" : "Create Client Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type TermsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panelClassName?: string;
};

export function TermsModal({
  open,
  onOpenChange,
  panelClassName = "ghost-border w-full max-w-3xl rounded-2xl border border-outline/30 bg-surface-container p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]",
}: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 py-6" />
      <DialogContent className={panelClassName}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-headline text-3xl font-bold tracking-tight text-primary-fixed">Terms and Conditions</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Please read before accepting booster inscription.</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-9 w-9 rounded-md"
            aria-label="Close terms and conditions"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto rounded-md border border-outline/20 bg-surface-dim/40 p-4 text-sm leading-relaxed text-on-surface-variant">
          <p>
            By submitting this form, you agree to provide true and accurate information. Any false information may result in refusal or suspension of your booster account.
          </p>
          <p>
            You are responsible for the security of your login credentials. Do not share your password with anyone and report suspicious activity immediately.
          </p>
          <p>
            Booster performance and conduct must follow platform standards, including respectful behavior, fair play, and compliance with game publisher policies.
          </p>
          <p>
            Payments, commissions, and account status are managed under platform rules and may be adjusted in case of abuse, fraud, or violation of these terms.
          </p>
          <p>
            Personal data is processed for account operations, fraud prevention, and service quality. By continuing, you acknowledge our data handling practices.
          </p>
          <p>
            Continued use of the platform means you accept updates to these terms when legally required, with notice provided through official channels.
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <Button type="button" variant="primary" size="sm" onClick={() => onOpenChange(false)}>
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
