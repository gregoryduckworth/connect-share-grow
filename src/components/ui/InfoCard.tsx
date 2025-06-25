import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface InfoCardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  headerRight?: React.ReactNode;
  contentTop?: React.ReactNode;
  contentBottom?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  cardHeaderClassName?: string;
  cardContentClassName?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  headerRight,
  contentTop,
  contentBottom,
  actions,
  className = "",
  cardHeaderClassName = "",
  cardContentClassName = "",
  ...props
}) => (
  <Card
    className={
      "flex flex-col h-full border-2 transition-shadow hover:shadow-xl hover:scale-[1.03] hover:border-purple-400 hover:bg-purple-50 focus-within:border-purple-500 focus-within:bg-purple-50 " +
      className
    }
    {...props}
  >
    <CardHeader className={"flex-1 pb-2 " + cardHeaderClassName}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <CardTitle className="text-base sm:text-lg break-words">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs sm:text-sm mt-1 break-words">
              {description}
            </CardDescription>
          )}
        </div>
        {headerRight && <div>{headerRight}</div>}
      </div>
    </CardHeader>
    <CardContent
      className={
        "flex flex-col flex-1 justify-end space-y-3 " + cardContentClassName
      }
    >
      {contentTop && <div>{contentTop}</div>}
      {contentBottom && <div>{contentBottom}</div>}
      {actions && <div className="flex gap-2 mt-auto w-full">{actions}</div>}
    </CardContent>
  </Card>
);

export default InfoCard;
