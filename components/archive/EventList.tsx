import { Event } from "@/types";

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  if (events.length === 0) return null;
// collect all unique stories across all events
const allStories = events.flatMap(e => e.stories.map(se => se.story))
  .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);
  
  return (
    <div className="event-list">

      {/* stories with their events */}
      {allStories
        .sort((a, b) => a.layer - b.layer)
        .map(story => (
          <div key={story.id} className="story">
            <div className="story-layer">layer {story.layer}</div>
            <p className="story-content">{story.content}</p>

            <div className="story-events">
              {events
                .filter(e => e.stories.some(se => se.story.id === story.id))
                .sort((a, b) => a.datetime > b.datetime ? 1 : -1)
                .map(event => (
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
                  </div>
                ))}
            </div>
          </div>
        ))}

      {/* events without stories */}
      {events
        .filter(e => e.stories.length === 0)
        .sort((a, b) => a.datetime > b.datetime ? 1 : -1)
        .map(event => (
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
          </div>
        ))}
    </div>
  );
}