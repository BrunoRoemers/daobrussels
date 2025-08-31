# Preview changes before publishing

A bunch of features come together to enable a smooth preview experience for a collection:

- Collections have versioning enabled, with the ability to store "unpublished" changes. Auto-save is triggered several times per second.
- Most of the frontend is able to show unpublished content when "draft mode" (NextJS) is enabled.
- The admin dashboard has a "preview" button that enables "draft mode" in the frontend and displays the current page.
- The admin dashboard has a "live preview" button that displays the current page in a side pane. The page refreshes on (auto)save.
