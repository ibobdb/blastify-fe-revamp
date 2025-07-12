/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Y3WLMa9Jc6n
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Component() {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Show Success Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center space-y-4 py-8">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
            <CheckIcon className="h-6 w-6 text-green-500 dark:text-green-400" />
          </div>
          <div className="space-y-2 text-center">
            <DialogTitle>Success!</DialogTitle>
            <DialogDescription>
              Your message has been sent successfully. We will get back to you
              as soon as possible.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
