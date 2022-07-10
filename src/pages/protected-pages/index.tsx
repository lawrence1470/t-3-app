import React from "react";

const ProtectedPage = () => {
    return (
        <div>
            <main>
                <h1>Protected page</h1>
                <p>
                    Only authenticated users can see this page. Every page under /protected-pages/ is protected using
                </p>
                <pre style={{textAlign: "center"}}>
          <code>withEdgeMiddlewareAuth()</code>
        </pre>
                <p>
                    Check the source code of the following file to see where the magic happens:
                </p>
                <pre style={{textAlign: "center"}}>
          <code>/pages/protected-pages/_middleware.js</code>
        </pre>
            </main>
        </div>
    );
};

export default ProtectedPage;
