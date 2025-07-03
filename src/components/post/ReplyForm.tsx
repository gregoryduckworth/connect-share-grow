import { FC } from "react";
import { Button } from "@/components/ui/button";
import AppAvatar from "@/components/common/AppAvatar";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ReplyFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  avatarSize?: string;
  buttonLabel?: string;
  dataTestIdInput?: string;
  dataTestIdButton?: string;
}

const ReplyForm: FC<ReplyFormProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Write a reply...",
  avatarSize = "h-10 w-10",
  buttonLabel = "Reply",
  dataTestIdInput,
  dataTestIdButton,
}) => (
  <div className="flex gap-3">
    <AppAvatar size={avatarSize} />
    <div className="flex-1 flex gap-3">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
        rows={3}
        data-testid={dataTestIdInput}
      />
      <Button
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="self-end"
        data-testid={dataTestIdButton}
      >
        <Send className="h-4 w-4" />
        {buttonLabel}
      </Button>
    </div>
  </div>
);

export default ReplyForm;
