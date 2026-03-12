import { useEffect, useState } from 'react';
import { fetchFromBackend } from '../utils/api';

interface PlayerCard {
    id: string;
    name: string;
    role: string;
    nationality: string;
    age: number;
    image: string;
    setNumber: number;
    setName: string;
}

const roleBadgeColor: Record<string, string> = {
    BATSMAN: '#f59e0b',
    BOWLER: '#3b82f6',
    'ALL-ROUNDER': '#8b5cf6',
    'WICKET-KEEPER': '#10b981',
    'WICKETKEEPER': '#10b981',
};

function getRoleColor(role: string): string {
    return roleBadgeColor[role.toUpperCase()] || '#6b7280';
}

export default function PlayersPage() {
    const [players, setPlayers] = useState<PlayerCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchFromBackend('/players')
            .then((data) => {
                setPlayers(
                    data.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        role: p.role,
                        nationality: p.nationality,
                        age: p.age,
                        image: p.image || '',
                        setNumber: p.set_number || 1,
                        setName: p.set_name || 'Unassigned',
                    }))
                );
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = players.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.role.toLowerCase().includes(search.toLowerCase()) ||
            p.nationality.toLowerCase().includes(search.toLowerCase())
    );

    // Group players by set
    const groupedPlayers = filtered.reduce((acc, player) => {
        if (!acc[player.setName]) {
            acc[player.setName] = [];
        }
        acc[player.setName].push(player);
        return acc;
    }, {} as Record<string, PlayerCard[]>);

    // Maintain order by setNumber
    const sortedSetNames = Object.keys(groupedPlayers).sort((a, b) => {
        return groupedPlayers[a][0].setNumber - groupedPlayers[b][0].setNumber;
    });

    return (
        <div style={styles.page}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.title}>
                    <span style={styles.titleAccent}>IPL</span> Player Roster
                </h1>
                <p style={styles.subtitle}>
                    {players.length} players registered across sets
                </p>
            </header>

            {/* Search */}
            <div style={styles.searchWrap}>
                <input
                    type="text"
                    placeholder="Search by name, role, or nationality..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />
                <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
            </div>

            {/* States */}
            {loading && (
                <div style={styles.stateMessage}>
                    <div style={styles.spinner} />
                    <p>Loading players...</p>
                </div>
            )}
            {error && (
                <div style={{ ...styles.stateMessage, color: '#ef4444' }}>
                    <p>⚠ {error}</p>
                </div>
            )}

            {/* Display Sets */}
            {!loading && !error && sortedSetNames.map((setName) => (
                <div key={setName} style={styles.setContainer}>
                    <h2 style={styles.setHeader}>{setName}</h2>
                    <div style={styles.grid}>
                        {groupedPlayers[setName].map((player) => (
                            <div key={player.id} className="player-card" style={styles.card}>
                                {/* Image */}
                                <div style={styles.imageWrap}>
                                    <img
                                        src={player.image}
                                        alt={player.name}
                                        style={styles.image}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                'https://www.iplt20.com/assets/images/IPL/placeholder.png';
                                        }}
                                    />
                                    <div
                                        style={{
                                            ...styles.roleBadge,
                                            backgroundColor: getRoleColor(player.role),
                                        }}
                                    >
                                        {player.role}
                                    </div>
                                </div>

                                {/* Info */}
                                <div style={styles.info}>
                                    <h3 style={styles.name}>{player.name}</h3>
                                    <div style={styles.details}>
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailIcon}>🌍</span>
                                            <span>{player.nationality}</span>
                                        </div>
                                        <div style={styles.detailRow}>
                                            <span style={styles.detailIcon}>🎂</span>
                                            <span>{player.age} years</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {!loading && !error && filtered.length === 0 && (
                <div style={styles.stateMessage}>
                    <p>No players match your search.</p>
                </div>
            )}

            {/* Inline styles for hover animation */}
            <style>{`
        .player-card {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .player-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08);
        }
        .player-card:hover img {
          transform: scale(1.08);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#e2e8f0',
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        padding: '40px 24px 80px',
    },
    header: {
        textAlign: 'center' as const,
        marginBottom: 32,
    },
    title: {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        margin: 0,
        color: '#fff',
    },
    titleAccent: {
        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 8,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
    },
    searchWrap: {
        maxWidth: 480,
        margin: '0 auto 40px',
        position: 'relative' as const,
    },
    searchInput: {
        width: '100%',
        padding: '14px 48px 14px 20px',
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#e2e8f0',
        fontSize: 15,
        outline: 'none',
        backdropFilter: 'blur(12px)',
        boxSizing: 'border-box' as const,
    },
    searchIcon: {
        position: 'absolute' as const,
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 20,
        height: 20,
        color: '#64748b',
    },
    stateMessage: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        color: '#94a3b8',
        fontSize: 16,
        gap: 16,
    },
    spinner: {
        width: 36,
        height: 36,
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#f59e0b',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    setContainer: {
        marginBottom: 48,
        maxWidth: 1280,
        margin: '0 auto 48px',
    },
    setHeader: {
        fontSize: 24,
        fontWeight: 800,
        marginBottom: 24,
        color: '#f8fafc',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: 12,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 24,
    },
    card: {
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        animation: 'fadeIn 0.4s ease forwards',
    },
    imageWrap: {
        position: 'relative' as const,
        height: 240,
        background: 'linear-gradient(180deg, rgba(15,15,26,0.3) 0%, rgba(26,26,46,0.8) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    image: {
        height: '100%',
        objectFit: 'contain' as const,
        transition: 'transform 0.3s ease',
    },
    roleBadge: {
        position: 'absolute' as const,
        top: 12,
        right: 12,
        padding: '4px 12px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase' as const,
        color: '#fff',
    },
    info: {
        padding: '16px 20px 20px',
    },
    name: {
        fontSize: 18,
        fontWeight: 700,
        margin: '0 0 12px',
        color: '#fff',
        letterSpacing: '-0.01em',
    },
    details: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 6,
    },
    detailRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        color: '#94a3b8',
    },
    detailIcon: {
        fontSize: 14,
        width: 20,
        textAlign: 'center' as const,
    },
};
