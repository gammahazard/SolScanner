'use client';

interface ProgressBarProps {
    current: number;
    total: number;
    currentToken?: string;
}

export function ProgressBar({ current, total, currentToken }: ProgressBarProps) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    const isLoading = current === 0 && total === 0;

    return (
        <div
            style={{
                padding: '1rem',
                backgroundColor: '#2a2b3d',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                width: '100%',
                maxWidth: '800px',
            }}
        >
            {/* Reserve consistent space for title and status */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    height: '32px', // Fixed height for the title/status area
                }}
            >
                <span style={{ color: '#9945FF', fontWeight: 'bold', fontSize: '1rem' }}>
                    {currentToken ? `Scanning ${currentToken}` : 'Progress'}
                </span>
                <span
                    style={{
                        color: '#9ca3af',
                        fontSize: '0.875rem',
                        transition: 'opacity 0.3s ease',
                        opacity: isLoading ? 0.7 : 1, // Smooth transition for text updates
                    }}
                >
                    {isLoading ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Fetching holders
                            <span className="loading-dots">...</span>
                        </span>
                    ) : (
                        `${current.toLocaleString()} / ${total.toLocaleString()} accounts`
                    )}
                </span>
            </div>

            {/* Progress bar */}
            <div
                style={{
                    width: '100%',
                    height: '20px',
                    backgroundColor: '#13141f',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: '#9945FF',
                        transition: 'width 0.5s ease-out',
                    }}
                />
            </div>

            {/* Reserve consistent space for completion percentage */}
            <div
                style={{
                    marginTop: '0.5rem',
                    textAlign: 'right',
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    height: '24px', // Fixed height for percentage text
                    lineHeight: '24px', // Vertical alignment
                }}
            >
                {isLoading ? '' : `${percentage}% complete`}
            </div>

            <style jsx>{`
                @keyframes loadingDots {
                    0% {
                        opacity: 0.2;
                    }
                    20% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0.2;
                    }
                }

                .loading-dots {
                    animation: loadingDots 1.4s infinite;
                }
            `}</style>
        </div>
    );
}
