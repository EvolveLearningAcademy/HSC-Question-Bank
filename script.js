//JavaScript for interactivity (filtering, etc.)

document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('year');
    const subjectSelect = document.getElementById('subject');
    const moduleSelect = document.getElementById('module');
    const topicSelect = document.getElementById('topic');
    const questionsList = document.getElementById('questions-list');

    // Load JSON data dynamically based on subject selection
    subjectSelect.addEventListener('change', () => {
        const subject = subjectSelect.value;

        if (subject === 'all') {
            resetFilters();
            return;
        }

        fetch(`data/${subject.toLowerCase()}.json`)
            .then(response => response.json())
            .then(data => {
                populateModules(data.modules);
                attachModuleFilter(data.papers, data.modules);
            })
            .catch(error => console.error('Error loading data:', error));
    });

    function resetFilters() {
        moduleSelect.innerHTML = '<option value="all">All Modules</option>';
        topicSelect.innerHTML = '<option value="all">All Topics</option>';
        questionsList.innerHTML = '';
    }

    function populateModules(modules) {
        moduleSelect.innerHTML = '<option value="all">All Modules</option>';
        topicSelect.innerHTML = '<option value="all">All Topics</option>';
        questionsList.innerHTML = '';

        modules.forEach(module => {
            const option = document.createElement('option');
            option.value = module.module;
            option.textContent = module.module;
            moduleSelect.appendChild(option);
        });
    }

    function attachModuleFilter(papers, modules) {
        moduleSelect.addEventListener('change', () => {
            const selectedModule = moduleSelect.value;
            topicSelect.innerHTML = '<option value="all">All Topics</option>';
            questionsList.innerHTML = '';

            if (selectedModule === 'all') return;

            const matchedModule = modules.find(m => m.module === selectedModule);

            if (matchedModule) {
                matchedModule.topics.forEach(topic => {
                    const option = document.createElement('option');
                    option.value = topic;
                    option.textContent = topic;
                    topicSelect.appendChild(option);
                });

                attachTopicFilter(papers, selectedModule);
            }
        });
    }

    function attachTopicFilter(papers, selectedModule) {
        topicSelect.addEventListener('change', () => {
            const selectedTopic = topicSelect.value;
            const selectedYear = yearSelect.value;
            questionsList.innerHTML = '';

            const filteredQuestions = papers
                .filter(paper => selectedYear === 'all' || paper.year === selectedYear)
                .flatMap(paper => paper.questions)
                .filter(q =>
                    (selectedModule === 'all' || q.module === selectedModule) &&
                    (selectedTopic === 'all' || q.topic === selectedTopic)
                );

            filteredQuestions.forEach(q => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="${q.url}#page=${q.page}" target="_blank">Question ${q.number} - ${q.topic} (${q.year})</a>`;
                questionsList.appendChild(listItem);
            });
        });
    }

    // Year filter change event to trigger questions update
    yearSelect.addEventListener('change', () => {
        topicSelect.dispatchEvent(new Event('change'));
    });
});
