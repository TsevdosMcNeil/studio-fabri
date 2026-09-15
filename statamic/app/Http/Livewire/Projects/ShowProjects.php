<?php

namespace App\Http\Livewire\Projects;

use Illuminate\Support\Facades\Log;
use Statamic\Facades\Entry;
use Livewire\Component;
//use Jonassiewertsen\Livewire\WithPagination;

class ShowProjects extends Component
{

    //use WithPagination;
    public $selectedFilter         = false;
    public $selectedSectorSlug     = [];
    public $selectedDisciplineSlug = [];
    public $sortOptions            = 'order';
    public $stickyElement          = null;

    
    /**
     * Set the initial parameters
     * 
     * @see https://statamic.com/addons/jonassiewertsen/livewire
     *
     * @param  string  $sortoptions
     * @param  object  $stickyelement
     * 
     * @return void
     */
    public function mount(
        $sortoptions, 
        $stickyelement
    ){
        $this->sortOptions   = $sortoptions;
        $this->stickyElement = $stickyelement;
    }

    /**
     * Get filtered projects sorted by the collection structure tree
     * 
     * As stated in the documentation, to sort manually, use sort="order", and make sure you set the maximum depth to 1 for your collection:
     * 
     * @see https://statamic.dev/tags/collection#parameters,
     *
     * @return object
     */
    public function entries() {
        //Log::info("Projects get entries");
        
        $entries = Entry::query()
            ->where('collection', 'projects') //AND query
            ->where('status', 'published') //AND query
            ->where('hide_in_projects_index', false); //AND query
        
        //AND query
        if(count($this->selectedSectorSlug)) {
            $this->selectedFilter = true;
            Log::info("Sector: ". print_r($this->selectedSectorSlug,true));
            $inSectors = []; 
            foreach ($this->selectedSectorSlug as $slug) {
                $inSectors[] ='sectors::'.$slug;
            }
            // OR query
            $entries = $entries->whereTaxonomyIn($inSectors);
            //$entries = $entries->whereTaxonomy('sectors::'.$this->selectedSectorSlug);
        }
        //AND query
        if(count($this->selectedDisciplineSlug)) {
            $this->selectedFilter = true;
            Log::info("Discipline: ".print_r($this->selectedDisciplineSlug,true));
            $inDisciplines = []; 
            foreach ($this->selectedDisciplineSlug as $slug) {
                $inDisciplines[] ='disciplines::'.$slug;
            }
            // OR query
            $entries = $entries->whereTaxonomyIn($inDisciplines);
            //$entries = $entries->whereTaxonomy('disciplines::'$this->selectedDisciplineSlug);
        }
        //Log::info("selectedFilter: ". print_r($this->selectedFilter,true));

        // https://statamic.dev/content-queries
        //Log::info(print_r($specificEntry->id, true));
        //Log::info('sortOptions: '.print_r($this->sortOptions, true));
        //Log::info('sortOptions: '.$this->sortOptions['value']);
        //Log::info('stickyElement: '.print_r($this->stickyElement, true));
        //Log::info('stickyElement: '.$this->stickyElement['id']);

        if($this->sortOptions == 'random' ) {

            if($this->stickyElement 
                && !$this->selectedFilter 
            ) { //Sort randomly but ensuring a specific value is always the first result

                // Fetch the specific record by ID
                $specificEntry = $entries->where('id', '=', $this->stickyElement)->first();
                //Log::info('specificEntry: '.print_r($specificEntry->id, true));
                //$specificEntry = $entries->orderBy('order')->first();
                
                //$randomEntries = $entries->where('id', '!=', $specificEntry->id)->inRandomOrder()->get();
                // Fetch the remaining records randomly
                $randomEntries = Entry::query()
                    ->where('collection', 'projects') 
                    ->where('status', 'published') 
                    ->where('hide_in_projects_index', false)
                    ->where('id', '!=', $this->stickyElement)->inRandomOrder()->get();

                // Combine the results
                //Log::info('sort randomly with sticky element' );
                $entries = collect([$specificEntry])->concat($randomEntries);
                //$entries = $randomEntries;

            } else {
                //Log::info('sort randomly' );
                $entries = $entries->inRandomOrder()->get();
            }
        } else {
            //Log::info('sort by order' );
            //$entries = $entries->orderBy('date', 'asc')->get();
            // To sort by "order" make sure you set the maximum depth to 1 for your collection
            $entries = $entries->orderBy('order')->get();
        }
        
        //Log::info('entries: '.print_r($entries, true));

        // Reset the filter flag
        $this->selectedFilter = false;

        return $entries;

        //$entries = $entries->paginate(5);
        //return $this->withPagination('entries', $entries);
    }

    /**
     * Render projects
     *
     * @return object
     */
    public function render() {
        //Log::info("Load Livewire ShowProjects: ". print_r($this->entries(),true));
        return view(
            'livewire.projects.show-projects', 
            ['projects' => $this->entries()]
        );
    }
}
