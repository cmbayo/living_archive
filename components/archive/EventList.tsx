import { Event } from "@/types";

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  if (events.length === 0) return null;

  return (
    <div className="event-list">
      {events.sort((a,b) => a.datetime > b.datetime ? 1 : -1).map(event => (
        <div key={event.id} className="event">
          <div className="event-header">
            <h3 className="event-name">{event.name}</h3>
            {event.major && <span className="event-major">major</span>}
          </div>
          <div className="event-date">
            {new Date(event.datetime).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <p className="event-description">{event.description}</p>

          {event.stories.length > 0 && (
            <div className="stories-list">
              {event.stories
                .sort((a, b) => a.story.layer - b.story.layer)
                .map(({ story }) => (
                  <div key={story.id} className="story">
                    <div className="story-layer">layer {story.layer}</div>
                    <p className="story-content">{story.content}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}