var WLB_WatchList_Raw_Data = {
    "WLB_WatchList_Data": 
    []
};

window.addEventListener('DOMContentLoaded', function(){
    WLB_Check_List_FromLocalStorage();
});

var WLB_WatchList_Data = [];

// Check the existence of the list in local storage
var WLB_KeyPrefix = "WLB"
function WLB_Check_List_FromLocalStorage(){
    if (localStorage.getItem(WLB_KeyPrefix + "_Manifest") != null){
        console.log("WLB manifest found");
        // Projects_Load_Manifest();
        // Projects_Generate_List();
        WLB_Load_ListData();
    } else if (localStorage.getItem(WLB_KeyPrefix + "_Manifest") == null){
        console.log("No WLB manifest found. Creating a new one.");
        // Projects_Create_EmptyManifest();
        WLB_Create_EmptyList();
    }
}

// If a manifest is found on local storage, load it and replace the data on WLB_WatchList_Data.
function WLB_Load_ListData(){
    WLB_WatchList_Raw_Data = JSON.parse(localStorage.getItem(WLB_KeyPrefix + "_Manifest"));
    WLB_WatchList_Data = WLB_WatchList_Raw_Data.WLB_WatchList_Data;
    WLB_Load_WatchList();
}

// If a manifest is not found on local storage, create an empty one.
function WLB_Create_EmptyList(){
    localStorage.setItem(WLB_KeyPrefix + "_Manifest", JSON.stringify(WLB_WatchList_Raw_Data));
    WLB_Check_List_FromLocalStorage();
}

// Saves WLB_WatchList_Data into local storage
function WLB_Save_ListData(){
    let Data = {
        "WLB_WatchList_Data": WLB_WatchList_Data
    }
    localStorage.setItem(WLB_KeyPrefix + "_Manifest", JSON.stringify(Data));
    WLB_Load_ListData();
}

// Erases everything
function WLB_ClearData(){
    localStorage.removeItem(WLB_KeyPrefix + "_Manifest");
    location.reload();
}
// Loads the watchlist from WLB_WatchList_Data object. Make sure to load the actual data first.
function WLB_Load_WatchList(){
    document.getElementById("tab_WatchList_Main").innerHTML = "";
    // Create series elements
    for (a = 0; a < WLB_WatchList_Data.length; a++){
        var WLB_WatchList_Series_Element_Name = WLB_WatchList_Data[a].Series_Name;
        var WLB_WatchList_Series_Element_State = WLB_WatchList_Data[a].Series_State;
        var WLB_WatchList_Series_Element_InnerHTML = `
            <div class="Accordion" id="WLB_Series_${a}" State="${WLB_WatchList_Series_Element_State}" Series="${a}">
                <div class="Accordion_Title" onclick="Accordion_Toggle(this.parentNode.id); setTimeout(WLB_Update_Series_State(this.parentNode.id), 500);">
                    <h2 class="Accordion_Title_Text">
                        ${WLB_WatchList_Series_Element_Name}
                    </h2>
                    <img class='Accordion_Title_Arrow' src='Assets/Icons/icon_upArrow.png' draggable='false' loading='lazy'/>
                </div>
                <div class="Accordion_Content" State="Expanded" id="WLB_Series_${a}_Episodes">
                    <!-- Episodes are inserted here -->
                </div>
            </div>
        `;

        var WLB_WatchList_Series_Element = document.createElement('span');
        WLB_WatchList_Series_Element.innerHTML = WLB_WatchList_Series_Element_InnerHTML;
        document.getElementById("tab_WatchList_Main").appendChild(WLB_WatchList_Series_Element);

        // Create episode elements inside the series container
        for (b = 0; b < WLB_WatchList_Data[a].Series_Episodes.length; b++){
            var WLB_WatchList_Episode_Element_EpisodeNumber = WLB_WatchList_Data[a].Series_Episodes[b].Episode_Number;
            var WLB_WatchList_Episode_Element_EpisodeDone = WLB_WatchList_Data[a].Series_Episodes[b].Episode_Done;
            var WLB_WatchList_Episode_Element_EpisodeDone_Status;
            if (WLB_WatchList_Episode_Element_EpisodeDone == true){
                WLB_WatchList_Episode_Element_EpisodeDone_Status = "Active";
            } else {
                WLB_WatchList_Episode_Element_EpisodeDone_Status = "Inactive";
            }

            var WLB_WatchList_Episode_Element_InnerHTML = `
                <div class="Toggle" id="WLB_Series_${a}_Episode_${b}" onclick="Buttons_Toggle(this.id); setTimeout(WLB_Update_Episode_State(this.id), 500)" State="${WLB_WatchList_Episode_Element_EpisodeDone_Status}" Series="${a}" Episode="${b}">
                    <div class="Toggle_Indicator"></div>
                    ${WLB_WatchList_Series_Element_Name} | Episode ${WLB_WatchList_Episode_Element_EpisodeNumber}
                </div>
            `;

            var WLB_WatchList_Episode_Element = document.createElement('span');
            WLB_WatchList_Episode_Element.innerHTML = WLB_WatchList_Episode_Element_InnerHTML;
            document.getElementById(`WLB_Series_${a}_Episodes`).appendChild(WLB_WatchList_Episode_Element);
        }
    }

    // Loads the series list in the Add Item window
    document.getElementById("WLB_AddItem_Episode_FromSeries_List").innerHTML = "";
    if (WLB_WatchList_Data.length != 0){
        for (a = 0; a < WLB_WatchList_Data.length; a++){
            var WLB_WatchList_Series_List_Element = document.createElement('p');
            WLB_WatchList_Series_List_Element.setAttribute('class', 'Dropdown_List_Item');
            WLB_WatchList_Series_List_Element.setAttribute('onclick', 'Dropdown_SubmitValue(this.parentNode, this.innerText); WLB_AddItem_Episode_Update_Series(this.getAttribute("Series"));');
            WLB_WatchList_Series_List_Element.setAttribute('Series', a);
            WLB_WatchList_Series_List_Element.innerText = WLB_WatchList_Data[a].Series_Name;
            document.getElementById("WLB_AddItem_Episode_FromSeries_List").appendChild(WLB_WatchList_Series_List_Element);
        }
    } else {
        var WLB_WatchList_Series_List_Element = document.createElement('p');
        WLB_WatchList_Series_List_Element.setAttribute('class', 'Dropdown_List_Item');
        WLB_WatchList_Series_List_Element.setAttribute('onclick', 'Dropdown_SubmitValue(this.parentNode, this.innerText); WLB_AddItem_Episode_Update_Series(this.getAttribute("Series"));');
        WLB_WatchList_Series_List_Element.setAttribute('Series', '-1');
        WLB_WatchList_Series_List_Element.innerText = "No series exists as of this particular moment. Care to create a series now by switching to the 'Series' tab above?";
        document.getElementById("WLB_AddItem_Episode_FromSeries_List").appendChild(WLB_WatchList_Series_List_Element);
        WLB_AddItem_Episode_Series = -1;
    }
    
}

var WLB_AddItem_Episode_Count = 0;
function WLB_AddItem_Episode_ComputeCount(){
    if (document.getElementById("WLB_AddItem_Episode_StartFrom").value != null || document.getElementById("WLB_AddItem_Episode_StartFrom").value != ""){
        if (document.getElementById("WLB_AddItem_Episode_StartFromAndTo").value != null || document.getElementById("WLB_AddItem_Episode_StartFromAndTo").value != ""){
            WLB_AddItem_Episode_Count = Math.abs(document.getElementById("WLB_AddItem_Episode_StartFromAndTo").value - document.getElementById("WLB_AddItem_Episode_StartFrom").value) + 1;
            document.getElementById("WLB_AddItem_Episode_StartFromAndTo_Count").innerHTML = "Episode count: " + WLB_AddItem_Episode_Count;
        }
    }
}

var WLB_AddItem_Episode_Series = 0;
function WLB_AddItem_Episode_Update_Series(Series){
    WLB_AddItem_Episode_Series = Series;
}

function WLB_AddItem(){
    if (Element_Attribute_Get('Tabs_Tab_Target_Container_Horizontal_1', 'Tabs_CurrentTab') == "WLB_AddItem_Series"){
        WLB_Add_Item_Series();
    } else if (Element_Attribute_Get('Tabs_Tab_Target_Container_Horizontal_1', 'Tabs_CurrentTab') == "WLB_AddItem_Episode"){
        WLB_Add_Item_Episode();
    }
}

function  WLB_Add_Item_Series(){
    var WLB_Add_Item_Series_Name = document.getElementById("WLB_AddItem_Series_Name").value;
    if (WLB_Add_Item_Series_Name != null || WLB_Add_Item_Series_Name != ''){
        let Data = {
            "Series_Name": WLB_Add_Item_Series_Name,
            "Series_Episodes": []
        }
        WLB_WatchList_Data.push(Data);
        WLB_Save_ListData();
        Toasts_CreateToast("Assets/Icons/icon_add.png", "Series created", "Switch to the episode tab to add episodes in it.");
    } else {
        Subwindows_Open("WLB_AddItem_Error_SeriesBlank");
    }    
}

function WLB_Add_Item_Episode(){
    if (WLB_AddItem_Episode_Series != -1){
        var WLB_Add_Item_Episode_StartFrom = document.getElementById("WLB_AddItem_Episode_StartFrom").value;
        var WLB_AddItem_Episode_StartFromAndTo = document.getElementById("WLB_AddItem_Episode_StartFromAndTo").value;
        var WLB_Add_Item_Episode = WLB_Add_Item_Episode_StartFrom - 1;
        console.log(WLB_Add_Item_Episode_StartFrom + " -- " + WLB_AddItem_Episode_StartFromAndTo);
        console.log(WLB_Add_Item_Episode_StartFrom < WLB_AddItem_Episode_StartFromAndTo);
        if (WLB_Add_Item_Episode_StartFrom < WLB_AddItem_Episode_StartFromAndTo){
            Subwindows_Open('WLB_AddItem_Error_EpisodeWrongOrder');
        } else {
            for (a = 0; a < WLB_AddItem_Episode_Count; a++){
                WLB_Add_Item_Episode++;
                let Data = {
                    "Episode_Number": WLB_Add_Item_Episode,
                    "Episode_Done": false
                }
                WLB_WatchList_Data[WLB_AddItem_Episode_Series].Series_Episodes.push(Data);
            }
            WLB_Save_ListData();
            Toasts_CreateToast("Assets/Icons/icon_add.png", "Episode(s) created", ` ${WLB_AddItem_Episode_Count} episodes have been added to series ${WLB_WatchList_Data[WLB_AddItem_Episode_Series].Series_Name}`);
        }
    } else {
        Subwindows_Open('WLB_AddItem_Error_EpisodeHasNoSelectedSeries');
    }
    
}

function WLB_Update_Series_State(ID){
    var WLB_Update_Series_State = Element_Attribute_Get(ID, "State");
    var WLB_Update_Series_Series = Element_Attribute_Get(ID, "State");
    WLB_WatchList_Data[WLB_Update_Series_Series].Series_State = WLB_Update_Series_State;
}

function WLB_Update_Episode_State(ID){
    var WLB_Update_Episode_State = Element_Attribute_Get(ID, "State");
    if (WLB_Update_Episode_State == "Active"){
        WLB_Update_Episode_State = true;
    } else {
        WLB_Update_Episode_State = false;
    }
    var WLB_Update_Episode_Series = Element_Attribute_Get(ID, "Series");
    var WLB_Update_Episode_Episode = Element_Attribute_Get(ID, "Episode");
    WLB_WatchList_Data[WLB_Update_Episode_Series].Series_Episodes[WLB_Update_Episode_Episode].Episode_Done = WLB_Update_Episode_State;
    WLB_Save_ListData();
}