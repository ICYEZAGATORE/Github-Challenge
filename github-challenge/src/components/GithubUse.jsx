import { useState, useEffect } from "react";

export default function GitHubUserSearch() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
    loadDefaultUser();
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  function loadDefaultUser() {
    setUser({
      login: "octocat",
      name: "The Octocat",
      avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
      bio: "GitHub mascot",
      created_at: "2011-01-25T18:44:36Z",
      public_repos: 8,
      followers: 3938,
      following: 9,
      location: "San Francisco",
      blog: "https://github.blog",
      twitter_username: "github",
      company: null,
    });
  }

  function searchUser(e) {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    fetch(`https://api.github.com/users/${username}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(
            response.status === 404 ? "User not found" : "Error fetching user"
          );
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setUser(null);
        setLoading(false);
      });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div
      className={
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }
    >
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">devfinder</h1>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "LIGHT 🌞" : "DARK 🌙"}
          </button>
        </header>

        <form onSubmit={searchUser} className="mb-6">
          <div className="flex items-center">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 flex-grow"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>

        {user && (
          <div className={darkMode ? "bg-gray-800 p-4" : "bg-white p-4"}>
            <div className="flex gap-4">
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-16 h-16 rounded-full"
              />

              <div>
                <h2 className="font-bold">{user.name || user.login}</h2>
                <a
                  href={`https://github.com/${user.login}`}
                  className="text-blue-500"
                >
                  @{user.login}
                </a>
                <p>Joined {formatDate(user.created_at)}</p>
                <p>{user.bio || "No bio available"}</p>

                <div className="grid grid-cols-3 gap-2 my-4 p-2 bg-opacity-50 bg-gray-200">
                  <div>
                    <p>Repos</p>
                    <p className="font-bold">{user.public_repos}</p>
                  </div>
                  <div>
                    <p>Followers</p>
                    <p className="font-bold">{user.followers}</p>
                  </div>
                  <div>
                    <p>Following</p>
                    <p className="font-bold">{user.following}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>📍 {user.location || "Not available"}</div>
                  <div>
                    🔗{" "}
                    {user.blog ? (
                      <a href={user.blog}>{user.blog}</a>
                    ) : (
                      "Not available"
                    )}
                  </div>
                  <div>
                    🐦{" "}
                    {user.twitter_username ? (
                      <a href={`https://twitter.com/${user.twitter_username}`}>
                        @{user.twitter_username}
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </div>
                  <div>🏢 {user.company || "Not available"}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
