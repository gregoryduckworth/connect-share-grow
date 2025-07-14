
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface SkillsAutocompleteProps {
  label: string;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  availableSkills: string[];
  placeholder?: string;
}

export const SkillsAutocomplete = ({
  label,
  selectedSkills,
  onSkillsChange,
  availableSkills,
  placeholder = "Type to add skills..."
}: SkillsAutocompleteProps) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = availableSkills.filter(skill =>
        skill.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedSkills.includes(skill)
      );
      setFilteredSkills(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSkills([]);
      setShowSuggestions(false);
    }
  }, [inputValue, availableSkills, selectedSkills]);

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      onSkillsChange([...selectedSkills, skill]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (filteredSkills.length > 0) {
        addSkill(filteredSkills[0]);
      } else {
        addSkill(inputValue.trim());
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
        />
        
        {showSuggestions && filteredSkills.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredSkills.map((skill) => (
              <div
                key={skill}
                className="px-3 py-2 cursor-pointer hover:bg-muted text-sm"
                onClick={() => addSkill(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSkills.map((skill) => (
            <Badge key={skill} variant="default" className="pr-1">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:bg-primary-foreground rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
