function RightColumn({ suggestions, toggleFollow }) {
    return (
        <aside className="right-column">
            <div className="welcome-panel">
                <span className="panel-kicker">YOUR WEEKLY RHYTHM</span>
                <strong>Keep showing up.</strong>
                <p>You have shared 4 posts this week. That is something worth celebrating.</p>
                <div className="progress-track"><span />
                </div>
                <small>4 of 5 posts</small>
            </div>
            <section className="suggestions">
                <div className="section-title">
                    <h2>Who to follow</h2>
                    <a href="#discover">See all</a>
                </div>
                {suggestions.map((person) => (
                    <div className="suggestion-row" key={person.handle}>
                        <img src={person.avatar} alt={person.name} />
                        <div>
                            <strong>{person.name}</strong>
                            <span>{person.handle}</span>
                        </div>
                        <button onClick={() => toggleFollow(person.handle)}>
                            Follow
                        </button>
                    </div>
                ))}
            </section>
            <section className="trending">
                <div className="section-title">
                    <h2>Trending today</h2>
                    <a href="#trends">View more</a>
                </div>
                <div className="trend">
                    <span>01</span>
                    <div>
                        <small>DESIGN · 2.4K POSTS</small>
                        <strong>#MadeWithCare</strong>
                    </div>
                </div>
                <div className="trend">
                    <span>02</span>
                    <div>
                        <small>WELLBEING · 1.8K POSTS</small>
                        <strong>#SlowMornings</strong>
                    </div>
                </div>
                <div className="trend">
                    <span>03</span>
                    <div>
                        <small>TRAVEL · 986 POSTS</small>
                        <strong>#LocalWonders</strong>
                    </div>
                </div>
            </section>
        </aside>
    );
}

export default RightColumn

