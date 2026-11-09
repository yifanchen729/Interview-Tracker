import type { Application } from "../data/ApplicationArray";
import './DailyGoal.css';

// Define props
type DailyGoalProps = {
  applications: Application[];
};

// Main function
export function DailyGoal({ applications }: DailyGoalProps) {
  const goal = 5;

  // Get today's local date once before checking the applications
  const today = new Date().toDateString();
  let applicationCount = 0;

  // Count applications with a recorded Applied date that matches today
  applications.forEach((application) => {
    const appliedEntry = application.statusHistory.find((entry) => {
      return entry.status === "Applied";
    });

    if (!appliedEntry?.changedAt) return;

    const appliedDate = new Date(appliedEntry.changedAt).toDateString();

    if (appliedDate === today) applicationCount++;
  });

  // Prevent progress to go over 100
  const progress = Math.min(applicationCount / goal, 1) * 100;

  return (
    // The entire goal card
    <div className="daily-goal">
      <p className="daily-goal-title">Daily goal</p>

      <p className="daily-goal-count">
        {applicationCount} of {goal} applications
      </p>

      {/* Background track and blue progress */}
      <div
        className="daily-goal-track"
      >
        <div
          className="daily-goal-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
