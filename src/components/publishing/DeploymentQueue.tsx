"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, Badge, Button, StatusIndicator } from "@/components/ui";

interface DeploymentItem {
  id: string;
  title: string;
  status: "pending" | "deploying" | "success" | "error";
  timestamp: Date;
}

export function DeploymentQueue() {
  const [deployments, setDeployments] = useState<DeploymentItem[]>([
    {
      id: "1",
      title: "Tactical Product Alpha",
      status: "success",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      title: "Classified Product Beta",
      status: "deploying",
      timestamp: new Date(),
    },
    {
      id: "3",
      title: "Restricted Product Gamma",
      status: "pending",
      timestamp: new Date(Date.now() + 300000),
    },
  ]);

  const getStatusVariant = (status: DeploymentItem["status"]) => {
    switch (status) {
      case "success": return "success";
      case "deploying": return "intelligence";
      case "error": return "danger";
      case "pending": return "default";
    }
  };

  const getStatusIndicator = (status: DeploymentItem["status"]) => {
    switch (status) {
      case "success": return "operational";
      case "deploying": return "operational";
      case "error": return "offline";
      case "pending": return "degraded";
    }
  };

  return (
    <Card variant="intelligence">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">DEPLOYMENT QUEUE</h3>
          <Badge variant="intelligence" pulse>
            {deployments.filter(d => d.status === "deploying").length} ACTIVE
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {deployments.map((deployment) => (
            <div
              key={deployment.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <StatusIndicator 
                    status={getStatusIndicator(deployment.status)}
                    size="sm"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{deployment.title}</h4>
                    <p className="text-xs text-slate-400">
                      {deployment.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(deployment.status)}>
                  {deployment.status.toUpperCase()}
                </Badge>
              </div>

              {deployment.status === "deploying" && (
                <div className="mt-3">
                  <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 animate-pulse" style={{ width: "60%" }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <Button variant="secondary" size="sm" className="w-full">
            VIEW FULL DEPLOYMENT LOG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
