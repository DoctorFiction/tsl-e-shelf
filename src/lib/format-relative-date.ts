function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay === 0) {
    if (diffHour === 0) {
      if (diffMin < 1) return "Just now";
      return `${diffMin} min ago`;
    }
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  } else if (diffDay === 1) {
    return "Yesterday";
  } else if (diffDay < 7) {
    return `${diffDay} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}
export default formatRelativeDate;
