import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, RefreshCcw } from "lucide-react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen max-w-md flex-col justify-between border-r-2 p-4">
        <div className="flex gap-1">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button size="icon">
            <ArrowLeft className="size-4" />
          </Button>
          <Button size="icon">
            <ArrowRight className="size-4" />
          </Button>
          <Button size="icon">
            <RefreshCcw className="size-4" />
          </Button>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
