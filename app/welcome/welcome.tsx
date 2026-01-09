import { Button } from "~/components/button"
import { TextField } from "~/components/text-field"
import { Select, SelectItem } from "~/components/select"
import { Link } from "~/components/link"
import { Checkbox } from "~/components/checkbox"
import { RadioGroup, Radio } from "~/components/radio-group"
import { Breadcrumb, Breadcrumbs } from "~/components/breadcrumbs"

export function Welcome({ message }: { message: string }) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-app-background py-16">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0 container mx-auto px-4">
        <header className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-mono font-bold text-primary-vivid uppercase tracking-widest animate-pulse">
            Terminal_UI
          </h1>
          <p className="font-mono text-app-muted text-sm">
            v1.0.0 // SYSTEM_READY
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-6xl">
          {/* Buttons Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-mono text-app-accent border-b border-primary-muted pb-2 uppercase">
              01_Buttons //
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="quiet">Quiet</Button>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" isDisabled>
                  Disabled
                </Button>
                <Button variant="quiet" isPending>
                  Pending
                </Button>
              </div>
            </div>
          </section>

          {/* Inputs Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-mono text-app-accent border-b border-primary-muted pb-2 uppercase">
              02_Inputs //
            </h2>
            <div className="space-y-4">
              <TextField
                label="System Code"
                placeholder="ENTER_CODE"
                description="Secure entry required."
              />
              <TextField
                label="Error State"
                defaultValue="INVALID_INPUT"
                isInvalid
                errorMessage="Critical Failure"
              />
              <TextField label="Disabled" defaultValue="LOCKED" isDisabled />
              <TextField
                label="Text Area"
                defaultValue="This is a text area."
                kind="textarea"
              />
              <TextField
                label="Text Area"
                defaultValue="This is an invalid text area."
                kind="textarea"
                isInvalid
                errorMessage="Critical Failure"
              />
            </div>
          </section>

          {/* Select & Links Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-mono text-app-accent border-b border-primary-muted pb-2 uppercase">
              03_Selection & Nav //
            </h2>
            <div className="space-y-8">
              <Select label="Access Level">
                <SelectItem id="guest">Guest Access</SelectItem>
                <SelectItem id="user">User Level 1</SelectItem>
                <SelectItem id="admin">Admin Root</SelectItem>
              </Select>

              <Select label="Access Level" isInvalid>
                <SelectItem id="guest">Guest Access</SelectItem>
                <SelectItem id="user">User Level 1</SelectItem>
                <SelectItem id="admin">Admin Root</SelectItem>
              </Select>

              <div className="flex flex-col gap-2">
                <Link href="#" variant="primary">
                  Navigate to Root
                </Link>
                <Link href="#" variant="secondary">
                  View System Logs
                </Link>
              </div>
            </div>
          </section>

          {/* Toggles Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-mono text-app-accent border-b border-primary-muted pb-2 uppercase">
              04_Toggles //
            </h2>
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <h3 className="font-mono text-app-muted text-sm uppercase">
                  Checkbox
                </h3>
                <div className="flex flex-col gap-2">
                  <Checkbox>Accept Terms</Checkbox>
                  <Checkbox isSelected>Auto-save</Checkbox>
                  <Checkbox isDisabled>Restricted Option</Checkbox>
                  <Checkbox isInvalid>Invalid Selection</Checkbox>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-mono text-app-muted text-sm uppercase">
                  Radio Group
                </h3>
                <RadioGroup
                  label="Notification Preference"
                  defaultValue="email"
                >
                  <Radio value="email">Email</Radio>
                  <Radio value="sms">SMS</Radio>
                  <Radio value="none">None</Radio>
                </RadioGroup>

                <RadioGroup label="Disabled Group" isDisabled>
                  <Radio value="on">On</Radio>
                  <Radio value="off">Off</Radio>
                </RadioGroup>

                <RadioGroup
                  label="Invalid Selection"
                  isInvalid
                  errorMessage="Selection required"
                >
                  <Radio value="a">Option A</Radio>
                  <Radio value="b">Option B</Radio>
                </RadioGroup>
              </div>
            </div>
          </section>

          {/* Breadcrumbs Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-mono text-app-accent border-b border-primary-muted pb-2 uppercase">
              05_Breadcrumbs //
            </h2>
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Breadcrumbs>
                    <Breadcrumb href="#">Home</Breadcrumb>
                    <Breadcrumb href="#">Level 1</Breadcrumb>
                    <Breadcrumb href="#">Level 2</Breadcrumb>
                    <Breadcrumb href="#">Level 3</Breadcrumb>
                  </Breadcrumbs>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
